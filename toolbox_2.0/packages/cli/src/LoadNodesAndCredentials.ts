import {
	CUSTOM_EXTENSION_ENV,
	UserSettings,
} from '@toolbox/toolbox-core';
import {
	ICredentialType,
	INodeType,
	INodeTypeData,
} from '@toolbox/toolbox-workflow';

import * as config from '../config';
import {
	access as fsAccess,
	readdir as fsReaddir,
	readFile as fsReadFile,
	stat as fsStat,
} from 'fs';
import * as glob from 'glob-promise';
import * as path from 'path';
import { promisify } from 'util';

const fsAccessAsync = promisify(fsAccess);
const fsReaddirAsync = promisify(fsReaddir);
const fsReadFileAsync = promisify(fsReadFile);
const fsStatAsync = promisify(fsStat);


class LoadNodesAndCredentialsClass {
	nodeTypes: INodeTypeData = {};

	credentialTypes: {
		[key: string]: ICredentialType
	} = {};

	excludeNodes: string[] | undefined = undefined;

	nodeModulesPath = '';

	async init() {
		// Get the path to the node-modules folder to be later able
		// to load the credentials and nodes
		const checkPaths = [
			// In case "toolbox" package is in same node_modules folder.
			path.join(__dirname, '..', '..', '..', '@toolbox/toolbox-workflow'),
			// In case "toolbox" package is the root and the packages are
			// in the "node_modules" folder underneath it.
			path.join(__dirname, '..', '..', 'node_modules', '@toolbox/toolbox-workflow'),
		];
		for (const checkPath of checkPaths) {
			try {
				await fsAccessAsync(checkPath);
				// Folder exists, so use it.
				this.nodeModulesPath = path.dirname(checkPath);
				break;
			} catch (error) {
				// Folder does not exist so get next one
				continue;
			}
		}

		if (this.nodeModulesPath === '') {
			throw new Error('Could not find "node_modules" folder!');
		}

		this.excludeNodes = config.get('nodes.exclude');

		// Get all the installed packages which contain toolbox nodes
		const packages = await this.gettoolboxNodePackages();

		for (const packageName of packages) {
			//console.log("=======", packageName);
			await this.loadDataFromPackage(packageName);
		}

		// Read nodes and credentials from custom directories
		const customDirectories = [];

		// Add "custom" folder in user-toolbox folder
		customDirectories.push(UserSettings.getUsertoolboxFolderCustomExtensionPath());

		// Add folders from special environment variable
		if (process.env[CUSTOM_EXTENSION_ENV] !== undefined) {
			const customExtensionFolders = process.env[CUSTOM_EXTENSION_ENV]!.split(';');
			customDirectories.push.apply(customDirectories, customExtensionFolders);
		}

		for (const directory of customDirectories) {
			await this.loadDataFromDirectory('CUSTOM', directory);
		}
	}


	/**
	 * Returns all the names of the packages which could
	 * contain toolbox nodes
	 *
	 * @returns {Promise<string[]>}
	 * @memberof LoadNodesAndCredentialsClass
	 */
	async gettoolboxNodePackages(): Promise<string[]> {
		const gettoolboxNodePackagesRecursive = async (relativePath: string): Promise<string[]> => {
			const results: string[] = [];
			const nodeModulesPath = `${this.nodeModulesPath}/${relativePath}`;
			for (const file of await fsReaddirAsync(nodeModulesPath)) {
				//console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", file);
				const istoolboxNodesPackage = file.indexOf('toolbox-nodes-') === 0;
				const isNpmScopedPackage = file.indexOf('@') === 0;
				if (!istoolboxNodesPackage && !isNpmScopedPackage) {
					continue;
				}
				if (!(await fsStatAsync(nodeModulesPath)).isDirectory()) {
					continue;
				}
				if (istoolboxNodesPackage) { results.push(`${relativePath}${file}`); }
				if (isNpmScopedPackage) {
					results.push(...await gettoolboxNodePackagesRecursive(`${relativePath}${file}/`));
				}
			}
			return results;
		};
		return gettoolboxNodePackagesRecursive('');
	}

	/**
	 * Loads credentials from a file
	 *
	 * @param {string} credentialName The name of the credentials
	 * @param {string} filePath The file to read credentials from
	 * @returns {Promise<void>}
	 * @memberof toolboxPackagesInformationClass
	 */
	async loadCredentialsFromFile(credentialName: string, filePath: string): Promise<void> {
		const tempModule = require(filePath);

		let tempCredential: ICredentialType;
		try {
			tempCredential = new tempModule[credentialName]() as ICredentialType;
		} catch (e) {
			if (e instanceof TypeError) {
				throw new Error(`Class with name "${credentialName}" could not be found. Please check if the class is named correctly!`);
			} else {
				throw e;
			}
		}

		this.credentialTypes[tempCredential.name] = tempCredential;
	}


	/**
	 * Loads a node from a file
	 *
	 * @param {string} packageName The package name to set for the found nodes
	 * @param {string} nodeName Tha name of the node
	 * @param {string} filePath The file to read node from
	 * @returns {Promise<void>}
	 * @memberof toolboxPackagesInformationClass
	 */
	async loadNodeFromFile(packageName: string, nodeName: string, filePath: string): Promise<void> {
		let tempNode: INodeType;
		let fullNodeName: string;

		const tempModule = require(filePath);
		//console.log("wwwwwwwwwwwwwwwwwwwwwwwwwww", packageName, nodeName, filePath);
		try {
			tempNode = new tempModule[nodeName]() as INodeType;
		} catch (error) {
			//console.error(`Error loading node "${nodeName}" from: "${filePath}"`);
			throw error;
		}

		fullNodeName = packageName + '.' + tempNode.description.name;
		tempNode.description.name = fullNodeName;

		if (tempNode.description.icon !== undefined &&
			tempNode.description.icon.startsWith('file:')) {
			// If a file icon gets used add the full path
			tempNode.description.icon = 'file:' + path.join(path.dirname(filePath), tempNode.description.icon.substr(5));
		}

		// Check if the node should be skiped
		if (this.excludeNodes !== undefined && this.excludeNodes.includes(fullNodeName)) {
			return;
		}

		this.nodeTypes[fullNodeName] = {
			type: tempNode,
			sourcePath: filePath,
		};
	}


	/**
	 * Loads nodes and credentials from the given directory
	 *
	 * @param {string} setPackageName The package name to set for the found nodes
	 * @param {string} directory The directory to look in
	 * @returns {Promise<void>}
	 * @memberof toolboxPackagesInformationClass
	 */
	async loadDataFromDirectory(setPackageName: string, directory: string): Promise<void> {
		const files = await glob(path.join(directory, '**/*\.@(node|credentials)\.js'));

		let fileName: string;
		let type: string;
		//console.log(setPackageName, directory, files);
		const loadPromises = [];
		for (const filePath of files) {
			[fileName, type] = path.parse(filePath).name.split('.');

			if (type === 'node') {
				loadPromises.push(this.loadNodeFromFile(setPackageName, fileName, filePath));
			} else if (type === 'credentials') {
				loadPromises.push(this.loadCredentialsFromFile(fileName, filePath));
			}
		}

		await Promise.all(loadPromises);
	}


	/**
	 * Loads nodes and credentials from the package with the given name
	 *
	 * @param {string} packageName The name to read data from
	 * @returns {Promise<void>}
	 * @memberof toolboxPackagesInformationClass
	 */
	async loadDataFromPackage(packageName: string): Promise<void> {
		// Get the absolute path of the package
		const packagePath = path.join(this.nodeModulesPath, packageName);

		// Read the data from the package.json file to see if any toolbox data is defiend
		const packageFileString = await fsReadFileAsync(path.join(packagePath, 'package.json'), 'utf8');
		const packageFile = JSON.parse(packageFileString);
		if (!packageFile.hasOwnProperty('toolbox')) {
			return;
		}
		//console.log("+++++++", packageName, packagePath,packageFileString,packageFile);

		let tempPath: string, filePath: string;

		// Read all node types
		let fileName: string, type: string;
		if (packageFile.toolbox.hasOwnProperty('nodes') && Array.isArray(packageFile.toolbox.nodes)) {
			for (filePath of packageFile.toolbox.nodes) {
				tempPath = path.join(packagePath, filePath);
				[fileName, type] = path.parse(filePath).name.split('.');
				await this.loadNodeFromFile(packageName, fileName, tempPath);
			}
		}

		// Read all credential types
		if (packageFile.toolbox.hasOwnProperty('credentials') && Array.isArray(packageFile.toolbox.credentials)) {
			for (filePath of packageFile.toolbox.credentials) {
				tempPath = path.join(packagePath, filePath);
				[fileName, type] = path.parse(filePath).name.split('.');
				this.loadCredentialsFromFile(fileName, tempPath);
			}
		}
	}
}



let packagesInformationInstance: LoadNodesAndCredentialsClass | undefined;

export function LoadNodesAndCredentials(): LoadNodesAndCredentialsClass {
	if (packagesInformationInstance === undefined) {
		packagesInformationInstance = new LoadNodesAndCredentialsClass();
	}
	//console.log(packagesInformationInstance);

	return packagesInformationInstance;
}
