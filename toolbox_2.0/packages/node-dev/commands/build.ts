import {
	UserSettings,
} from "@toolbox/toolbox-core";
import { Command, flags } from '@oclif/command';

import {
	buildFiles,
	IBuildOptions,
} from '../src';

export class Build extends Command {
	static description = 'Builds credentials and nodes and copies it to toolbox custom extension folder';

	static examples = [
		`$ @toolbox/toolbox-node-dev build`,
		`$ @toolbox/toolbox-node-dev --destination ~/toolbox-nodes`,
		`$ @toolbox/toolbox-node-dev build --watch`,
	];

	static flags = {
		help: flags.help({ char: 'h' }),
		destination: flags.string({
			char: 'd',
			description: `The path to copy the compiles files to [default: ${UserSettings.getUsertoolboxFolderCustomExtensionPath()}]`,
		}),
		watch: flags.boolean({
			description: 'Starts in watch mode and automatically builds and copies file whenever they change',
		}),
	};

	async run() {
		const { flags } = this.parse(Build);

		this.log('\nBuild credentials and nodes');
		this.log('=========================');

		try {
			const options: IBuildOptions = {};

			if (flags.destination) {
				options.destinationFolder = flags.destination;
			}
			if (flags.watch) {
				options.watch = true;
			}

			const outputDirectory = await buildFiles(options);

			this.log(`The nodes got build and saved into the following folder:\n${outputDirectory}`);

		} catch (error) {
			this.log(`\nGOT ERROR: "${error.message}"`);
			this.log('====================================');
			this.log(error.stack);
			return;
		}

	}
}
