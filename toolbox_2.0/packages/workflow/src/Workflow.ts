
import {
	IConnections,
	IGetExecuteTriggerFunctions,
	INode,
	INodes,
	INodeExecuteFunctions,
	INodeExecutionData,
	INodeIssues,
	INodeParameters,
	INodeType,
	INodeTypes,
	IPollFunctions,
	IRunExecutionData,
	ITaskDataConnections,
	ITriggerResponse,
	IWebhookData,
	IWebhookResponseData,
	IWorfklowIssues,
	IWorkflowExecuteAdditionalData,
	IWorkflowSettings,
	NodeHelpers,
	NodeParameterValue,
	ObservableObject,
	WebhookSetupMethodNames,
	WorkflowDataProxy,
	WorkflowExecuteMode,
} from './';

// @ts-ignore
import * as tmpl from 'riot-tmpl';
import { IConnection, IDataObject, IObservableObject } from './Interfaces';

// Set it to use double curly brackets instead of single ones
tmpl.brackets.set('{{ }}');

// Make sure that it does not always print an error when it could not resolve
// a variable
tmpl.tmpl.errorHandler = () => { };


export class Workflow {
	id: string | undefined;
	name: string | undefined;
	nodes: INodes = {};
	connectionsBySourceNode: IConnections;
	connectionsByDestinationNode: IConnections;
	nodeTypes: INodeTypes;
	active: boolean;
	settings: IWorkflowSettings;

	// To save workflow specific static data like for example
	// ids of registred webhooks of nodes
	staticData: IDataObject;

	// constructor(id: string | undefined, nodes: INode[], connections: IConnections, active: boolean, nodeTypes: INodeTypes, staticData?: IDataObject, settings?: IWorkflowSettings) {
	constructor(parameters: {id?: string, name?: string, nodes: INode[], connections: IConnections, active: boolean, nodeTypes: INodeTypes, staticData?: IDataObject, settings?: IWorkflowSettings}) {
		this.id = parameters.id;
		this.name = parameters.name;
		this.nodeTypes = parameters.nodeTypes;

		// Save nodes in workflow as object to be able to get the
		// nodes easily by its name.
		// Also directly add the default values of the node type.
		let nodeType: INodeType | undefined;
		for (const node of parameters.nodes) {
			this.nodes[node.name] = node;
			nodeType = this.nodeTypes.getByName(node.type);

			if (nodeType === undefined) {
				// Go on to next node when its type is not known.
				// For now do not error because that causes problems with
				// expression resolution also then when the unknown node
				// does not get used.
				continue;
				// throw new Error(`The node type "${node.type}" of node "${node.name}" is not known.`);
			}

			// Add default values
			const nodeParameters = NodeHelpers.getNodeParameters(nodeType.description.properties, node.parameters, true, false);
			node.parameters = nodeParameters !== null ? nodeParameters : {};
		}
		this.connectionsBySourceNode = parameters.connections;

		// Save also the connections by the destionation nodes
		this.connectionsByDestinationNode = this.__getConnectionsByDestination(parameters.connections);

		this.active = parameters.active || false;

		this.staticData = ObservableObject.create(parameters.staticData || {}, undefined, { ignoreEmptyOnFirstChild: true });

		this.settings = parameters.settings || {};
	}



	/**
	 * The default connections are by source node. This function rewrites them by destination nodes
	 * to easily find parent nodes.
	 *
	 * @param {IConnections} connections
	 * @returns {IConnections}
	 * @memberof Workflow
	 */
	__getConnectionsByDestination(connections: IConnections): IConnections {
		const returnConnection: IConnections = {};

		let connectionInfo;
		let maxIndex: number;
		for (const sourceNode in connections) {
			if (!connections.hasOwnProperty(sourceNode)) {
				continue;
			}
			for (const type in connections[sourceNode]) {
				if (!connections[sourceNode].hasOwnProperty(type)) {
					continue;
				}
				for (const inputIndex in connections[sourceNode][type]) {
					if (!connections[sourceNode][type].hasOwnProperty(inputIndex)) {
						continue;
					}
					for (connectionInfo of connections[sourceNode][type][inputIndex]) {
						if (!returnConnection.hasOwnProperty(connectionInfo.node)) {
							returnConnection[connectionInfo.node] = {};
						}
						if (!returnConnection[connectionInfo.node].hasOwnProperty(connectionInfo.type)) {
							returnConnection[connectionInfo.node][connectionInfo.type] = [];
						}

						maxIndex = returnConnection[connectionInfo.node][connectionInfo.type].length - 1;
						for (let j = maxIndex; j < connectionInfo.index; j++) {
							returnConnection[connectionInfo.node][connectionInfo.type].push([]);
						}

						returnConnection[connectionInfo.node][connectionInfo.type][connectionInfo.index].push({
							node: sourceNode,
							type,
							index: parseInt(inputIndex, 10)
						});
					}
				}
			}
		}

		return returnConnection;
	}



	/**
	 * Converts an object to a string in a way to make it clear that
	 * the value comes from an object
	 *
	 * @param {object} value
	 * @returns {string}
	 * @memberof Workflow
	 */
	convertObjectValueToString(value: object): string {
		const typeName = Array.isArray(value) ? 'Array' : 'Object';
		return `[${typeName}: ${JSON.stringify(value)}]`;
	}



	/**
	 * A workflow can only be activated if it has a node which has either triggers
	 * or webhooks defined.
	 *
	 * @param {string[]} [ignoreNodeTypes] Node-types to ignore in the check
	 * @returns {boolean}
	 * @memberof Workflow
	 */
	checkIfWorkflowCanBeActivated(ignoreNodeTypes?: string[]): boolean {
		let node: INode;
		let nodeType: INodeType | undefined;

		for (const nodeName of Object.keys(this.nodes)) {
			node = this.nodes[nodeName];

			if (node.disabled === true) {
				// Deactivated nodes can not trigger a run so ignore
				continue;
			}

			if (ignoreNodeTypes !== undefined && ignoreNodeTypes.includes(node.type)) {
				continue;
			}

			nodeType = this.nodeTypes.getByName(node.type);

			if (nodeType === undefined) {
				// Type is not known so check is not possible
				continue;
			}

			if (nodeType.poll !== undefined || nodeType.trigger !== undefined || nodeType.webhook !== undefined) {
				// Is a trigger node. So workflow can be activated.
				return true;
			}
		}

		return false;
	}



	/**
	 * Checks if everything in the workflow is complete
	 * and ready to be executed. If it returns null everything
	 * is fine. If there are issues it returns the issues
	 * which have been found for the different nodes.
	 * TODO: Does currently not check for credential issues!
	 *
	 * @returns {(IWorfklowIssues | null)}
	 * @memberof Workflow
	 */
	checkReadyForExecution(): IWorfklowIssues | null {
		let node: INode;
		let nodeType: INodeType | undefined;
		let nodeIssues: INodeIssues | null = null;
		const workflowIssues: IWorfklowIssues = {};

		for (const nodeName of Object.keys(this.nodes)) {
			nodeIssues = null;
			node = this.nodes[nodeName];

			if (node.disabled === true) {
				continue;
			}

			nodeType = this.nodeTypes.getByName(node.type);

			if (nodeType === undefined) {
				// Node type is not known
				nodeIssues = {
					typeUnknown: true,
				};
			} else {
				nodeIssues = NodeHelpers.getNodeParametersIssues(nodeType.description.properties, node);
			}

			if (nodeIssues !== null) {
				workflowIssues[node.name] = nodeIssues;
			}
		}

		if (Object.keys(workflowIssues).length === 0) {
			return null;
		}

		return workflowIssues;
	}



	/**
	 * Returns the static data of the workflow.
	 * It gets saved with the workflow and will be the same for
	 * all workflow-executions.
	 *
	 * @param {string} type The type of data to return ("global"|"node")
	 * @param {INode} [node] If type is set to "node" then the node has to be provided
	 * @returns {IDataObject}
	 * @memberof Workflow
	 */
	getStaticData(type: string, node?: INode): IDataObject {
		let key: string;
		if (type === 'global') {
			key = 'global';
		} else if (type === 'node') {
			if (node === undefined) {
				throw new Error(`The request data of context type "node" the node parameter has to be set!`);
			}
			key = `node:${node.name}`;
		} else {
			throw new Error(`The context type "${type}" is not know. Only "global" and node" are supported!`);
		}

		if (this.staticData[key] === undefined) {
			// Create it as ObservableObject that we can easily check if the data changed
			// to know if the workflow with its data has to be saved afterwards or not.
			this.staticData[key] = ObservableObject.create({}, this.staticData as IObservableObject);
		}

		return this.staticData[key] as IDataObject;
	}



	/**
	 * Returns all the trigger nodes in the workflow.
	 *
	 * @returns {INode[]}
	 * @memberof Workflow
	 */
	getTriggerNodes(): INode[] {
		return this.queryNodes((nodeType: INodeType) => !!nodeType.trigger );
	}


	/**
	 * Returns all the poll nodes in the workflow
	 *
	 * @returns {INode[]}
	 * @memberof Workflow
	 */
	getPollNodes(): INode[] {
		return this.queryNodes((nodeType: INodeType) => !!nodeType.poll );
	}


	/**
	 * Returns all the nodes in the workflow for which the given
	 * checkFunction return true
	 *
	 * @param {(nodeType: INodeType) => boolean} checkFunction
	 * @returns {INode[]}
	 * @memberof Workflow
	 */
	queryNodes(checkFunction: (nodeType: INodeType) => boolean): INode[] {
		const returnNodes: INode[] = [];

		// Check if it has any of them
		let node: INode;
		let nodeType: INodeType | undefined;

		for (const nodeName of Object.keys(this.nodes)) {
			node = this.nodes[nodeName];

			if (node.disabled === true) {
				continue;
			}

			nodeType = this.nodeTypes.getByName(node.type);

			if (nodeType !== undefined && checkFunction(nodeType)) {
				returnNodes.push(node);
			}
		}

		return returnNodes;
	}



	/**
	 * Returns the node with the given name if it exists else null
	 *
	 * @param {string} nodeName Name of the node to return
	 * @returns {(INode | null)}
	 * @memberof Workflow
	 */
	getNode(nodeName: string): INode | null {
		if (this.nodes.hasOwnProperty(nodeName)) {
			return this.nodes[nodeName];
		}

		return null;
	}


	/**
	 * Renames nodes in expressions
	 *
	 * @param {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[])} parameterValue The parameters to check for expressions
	 * @param {string} currentName The current name of the node
	 * @param {string} newName The new name
	 * @returns {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[])}
	 * @memberof Workflow
	 */
	renameNodeInExpressions(parameterValue: NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[], currentName: string, newName: string): NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[] {
		if (typeof parameterValue !== 'object') {
			// Reached the actual value
			if (typeof parameterValue === 'string' && parameterValue.charAt(0) === '=') {
				// Is expression so has to be rewritten

				// To not run the "expensive" regex stuff when it is not needed
				// make a simple check first if it really contains the the node-name
				if (parameterValue.includes(currentName)) {
					// Really contains node-name (even though we do not know yet if really as $node-expression)

					// In case some special characters are used in name escape them
					const currentNameEscaped = currentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

					parameterValue = parameterValue.replace(new RegExp(`(\\$node(\.|\\["|\\[\'))${currentNameEscaped}((\.|"\\]|\'\\]))`, 'g'), `$1${newName}$3`);
				}
			}

			return parameterValue;
		}

		if (Array.isArray(parameterValue)) {
			const returnArray: any[] = []; // tslint:disable-line:no-any

			for (const currentValue of parameterValue) {
				returnArray.push(this.renameNodeInExpressions(currentValue, currentName, newName));
			}

			return returnArray;
		}

		const returnData: any = {}; // tslint:disable-line:no-any

		for (const parameterName of Object.keys(parameterValue)) {
			returnData[parameterName] = this.renameNodeInExpressions(parameterValue[parameterName], currentName, newName);
		}

		return returnData;
	}



	/**
	 * Rename a node in the workflow
	 *
	 * @param {string} currentName The current name of the node
	 * @param {string} newName The new name
	 * @memberof Workflow
	 */
	renameNode(currentName: string, newName: string) {

		// Rename the node itself
		if (this.nodes[currentName] !== undefined) {
			this.nodes[newName] = this.nodes[currentName];
			this.nodes[newName].name = newName;
			delete this.nodes[currentName];
		}

		// Update the expressions which reference the node
		// with its old name
		for (const node of Object.values(this.nodes)) {
			node.parameters = this.renameNodeInExpressions(node.parameters, currentName, newName) as INodeParameters;
		}

		// Change all source connections
		if (this.connectionsBySourceNode.hasOwnProperty(currentName)) {
			this.connectionsBySourceNode[newName] = this.connectionsBySourceNode[currentName];
			delete this.connectionsBySourceNode[currentName];
		}

		// Change all destination connections
		let sourceNode: string, type: string, sourceIndex: string, connectionIndex: string, connectionData: IConnection;
		for (sourceNode of Object.keys(this.connectionsBySourceNode)) {
			for (type of Object.keys(this.connectionsBySourceNode[sourceNode])) {
				for (sourceIndex of Object.keys(this.connectionsBySourceNode[sourceNode][type])) {
					for (connectionIndex of Object.keys(this.connectionsBySourceNode[sourceNode][type][parseInt(sourceIndex, 10)])) {
						connectionData = this.connectionsBySourceNode[sourceNode][type][parseInt(sourceIndex, 10)][parseInt(connectionIndex, 10)];
						if (connectionData.node === currentName) {
							connectionData.node = newName;
						}
					}
				}
			}
		}

		// Use the updated connections to create updated connections by destionation nodes
		this.connectionsByDestinationNode = this.__getConnectionsByDestination(this.connectionsBySourceNode);
	}



	/**
	 * Finds the highest parent nodes of the node with the given name
	 *
	 * @param {string} nodeName
	 * @param {string} [type='main']
	 * @param {number} [nodeConnectionIndex]
	 * @returns {string[]}
	 * @memberof Workflow
	 */
	getHighestNode(nodeName: string, type = 'main', nodeConnectionIndex?:number, checkedNodes?: string[]): string[] {
		const currentHighest: string[] = [];
		if (this.nodes[nodeName].disabled === false) {
			// If the current node is not disabled itself is the highest
			currentHighest.push(nodeName);
		}

		if (!this.connectionsByDestinationNode.hasOwnProperty(nodeName)) {
			// Node does not have incoming connections
			return currentHighest;
		}

		if (!this.connectionsByDestinationNode[nodeName].hasOwnProperty(type)) {
			// Node does not have incoming connections of given type
			return currentHighest;
		}

		checkedNodes = checkedNodes || [];

		if (checkedNodes!.includes(nodeName)) {
			// Node got checked already before
			return currentHighest;
		}

		checkedNodes!.push(nodeName);

		const returnNodes: string[] = [];
		let addNodes: string[];

		let connectionsByIndex: IConnection[];
		for (let connectionIndex = 0; connectionIndex < this.connectionsByDestinationNode[nodeName][type].length; connectionIndex++) {
			if (nodeConnectionIndex !== undefined && nodeConnectionIndex !== connectionIndex) {
				// If a connection-index is given ignore all other ones
				continue;
			}
			connectionsByIndex = this.connectionsByDestinationNode[nodeName][type][connectionIndex];
			connectionsByIndex.forEach((connection) => {
				if (checkedNodes!.includes(connection.node)) {
					// Node got checked already before
					return;
				}

				addNodes = this.getHighestNode(connection.node, type, undefined, checkedNodes);

				if (addNodes.length === 0) {
					// The checked node does not have any further parents so add it
					// if it is not disabled
					if (this.nodes[connection.node].disabled !== true) {
						addNodes = [connection.node];
					}
				}

				addNodes.forEach((name) => {
					// Only add if node is not on the list already anyway
					if (returnNodes.indexOf(name) === -1) {
						returnNodes.push(name);
					}
				});
			});
		}

		return returnNodes;
	}



	/**
	 * Returns all the after the given one
	 *
	 * @param {string} nodeName
	 * @param {string} [type='main']
	 * @param {*} [depth=-1]
	 * @returns {string[]}
	 * @memberof Workflow
	 */
	getChildNodes(nodeName: string, type = 'main', depth = -1): string[] {
		return this.getConnectedNodes(this.connectionsBySourceNode, nodeName, type, depth);
	}



	/**
	 * Returns all the nodes before the given one
	 *
	 * @param {string} nodeName
	 * @param {string} [type='main']
	 * @param {*} [depth=-1]
	 * @returns {string[]}
	 * @memberof Workflow
	 */
	getParentNodes(nodeName: string, type = 'main', depth = -1): string[] {
		return this.getConnectedNodes(this.connectionsByDestinationNode, nodeName, type, depth);
	}



	/**
	 * Gets all the nodes which are connected nodes starting from
	 * the given one
	 *
	 * @param {IConnections} connections
	 * @param {string} nodeName
	 * @param {string} [type='main']
	 * @param {*} [depth=-1]
	 * @param {string[]} [checkedNodes]
	 * @returns {string[]}
	 * @memberof Workflow
	 */
	getConnectedNodes(connections: IConnections, nodeName: string, type = 'main', depth = -1, checkedNodes?: string[]): string[] {
		depth = depth === -1 ? -1 : depth;
		const newDepth = depth === -1 ? depth : depth - 1;
		if (depth === 0) {
			// Reached max depth
			return [];
		}

		if (!connections.hasOwnProperty(nodeName)) {
			// Node does not have incoming connections
			return [];
		}

		if (!connections[nodeName].hasOwnProperty(type)) {
			// Node does not have incoming connections of given type
			return [];
		}

		checkedNodes = checkedNodes || [];

		if (checkedNodes!.includes(nodeName)) {
			// Node got checked already before
			return [];
		}

		checkedNodes!.push(nodeName);

		const returnNodes: string[] = [];
		let addNodes: string[];
		let nodeIndex: number;
		let i: number;
		let parentNodeName: string;
		connections[nodeName][type].forEach((connectionsByIndex) => {
			connectionsByIndex.forEach((connection) => {
				if (checkedNodes!.includes(connection.node)) {
					// Node got checked already before
					return;
				}

				returnNodes.unshift(connection.node);

				addNodes = this.getConnectedNodes(connections, connection.node, type, newDepth, checkedNodes);

				for (i = addNodes.length; i--; i > 0) {
					// Because nodes can have multiple parents it is possible that
					// parts of the tree is parent of both and to not add nodes
					// twice check first if they already got added before.
					parentNodeName = addNodes[i];
					nodeIndex = returnNodes.indexOf(parentNodeName);

					if (nodeIndex !== -1) {
						// Node got found before so remove it from current location
						// that node-order stays correct
						returnNodes.splice(nodeIndex, 1);
					}

					returnNodes.unshift(parentNodeName);
				}
			});
		});

		return returnNodes;
	}



	/**
	 * Returns via which output of the parent-node the node
	 * is connected to.
	 *
	 * @param {string} nodeName The node to check how it is connected with parent node
	 * @param {string} parentNodeName The parent node to get the output index of
	 * @param {string} [type='main']
	 * @param {*} [depth=-1]
	 * @param {string[]} [checkedNodes]
	 * @returns {(number | undefined)}
	 * @memberof Workflow
	 */
	getNodeConnectionOutputIndex(nodeName: string, parentNodeName: string, type = 'main', depth = -1, checkedNodes?: string[]): number | undefined {
		depth = depth === -1 ? -1 : depth;
		const newDepth = depth === -1 ? depth : depth - 1;
		if (depth === 0) {
			// Reached max depth
			return undefined;
		}

		if (!this.connectionsByDestinationNode.hasOwnProperty(nodeName)) {
			// Node does not have incoming connections
			return undefined;
		}

		if (!this.connectionsByDestinationNode[nodeName].hasOwnProperty(type)) {
			// Node does not have incoming connections of given type
			return undefined;
		}

		checkedNodes = checkedNodes || [];

		if (checkedNodes!.includes(nodeName)) {
			// Node got checked already before
			return undefined;
		}

		checkedNodes!.push(nodeName);

		let outputIndex: number | undefined;
		for (const connectionsByIndex of this.connectionsByDestinationNode[nodeName][type]) {
			for (const connection of connectionsByIndex) {
				if (parentNodeName === connection.node) {
					return connection.index;
				}

				if (checkedNodes!.includes(connection.node)) {
					// Node got checked already before
					return;
				}

				outputIndex = this.getNodeConnectionOutputIndex(connection.node, parentNodeName, type, newDepth, checkedNodes);

				if (outputIndex !== undefined) {
					return outputIndex;
				}
			}
		}

		return undefined;
	}



	/**
	 * Resolves value of parameter. But does not work for workflow-data.
	 *
	 * @param {INode} node
	 * @param {(string | undefined)} parameterValue
	 * @param {string} [defaultValue]
	 * @returns {(string | undefined)}
	 * @memberof Workflow
	 */
	getSimpleParameterValue(node: INode, parameterValue: string | boolean | undefined, defaultValue?: boolean | number | string): boolean | number | string | undefined {
		if (parameterValue === undefined) {
			// Value is not set so return the default
			return defaultValue;
		}

		// Get the value of the node (can be an expression)
		const runIndex = 0;
		const itemIndex = 0;
		const connectionInputData: INodeExecutionData[] = [];
		const runData: IRunExecutionData = {
			resultData: {
				runData: {},
			}
		};

		return this.getParameterValue(parameterValue, runData, runIndex, itemIndex, node.name, connectionInputData) as boolean | number | string | undefined;
	}

	/**
	 * Resolves value of complex parameter. But does not work for workflow-data.
	 *
	 * @param {INode} node
	 * @param {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[])} parameterValue
	 * @param {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[] | undefined)} [defaultValue]
	 * @returns {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[] | undefined)}
	 * @memberof Workflow
	 */
	getComplexParameterValue(node: INode, parameterValue: NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[], defaultValue: NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[] | undefined = undefined): NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[] | undefined {
		if (parameterValue === undefined) {
			// Value is not set so return the default
			return defaultValue;
		}

		// Get the value of the node (can be an expression)
		const runIndex = 0;
		const itemIndex = 0;
		const connectionInputData: INodeExecutionData[] = [];
		const runData: IRunExecutionData = {
			resultData: {
				runData: {},
			}
		};

		// Resolve the "outer" main values
		const returnData = this.getParameterValue(parameterValue, runData, runIndex, itemIndex, node.name, connectionInputData);

		// Resolve the "inner" values
		return this.getParameterValue(returnData, runData, runIndex, itemIndex, node.name, connectionInputData);
	}

	/**
	 * Returns from which of the given nodes the workflow should get started from
	 *
	 * @param {string[]} nodeNames The potential start nodes
	 * @returns {(INode | undefined)}
	 * @memberof Workflow
	 */
	__getStartNode(nodeNames: string[]): INode | undefined {
		// Check if there are any trigger or poll nodes and then return the first one
		let node: INode;
		let nodeType: INodeType;
		for (const nodeName of nodeNames) {
			node = this.nodes[nodeName];
			nodeType = this.nodeTypes.getByName(node.type) as INodeType;


			if (nodeType.trigger !== undefined || nodeType.poll !== undefined) {
				if (node.disabled === true) {
					continue;
				}
				return node;
			}
		}

		// Check if there is the actual "start" node
		const startNodeType = 'toolbox-nodes-base.start';
		for (const nodeName of nodeNames) {
			node = this.nodes[nodeName];
			if (node.type === startNodeType) {
				return node;
			}
		}

		return undefined;
	}



	/**
	 * Returns the start node to start the worfklow from
	 *
	 * @param {string} [destinationNode]
	 * @returns {(INode | undefined)}
	 * @memberof Workflow
	 */
	getStartNode(destinationNode?: string): INode | undefined {

		if (destinationNode) {
			// Find the highest parent nodes of the given one
			const nodeNames = this.getHighestNode(destinationNode);

			if (nodeNames.length === 0) {
				// If no parent nodes have been found then only the destination-node
				// is in the tree so add that one
				nodeNames.push(destinationNode);
			}

			// Check which node to return as start node
			const node = this.__getStartNode(nodeNames);
			if (node !== undefined) {
				return node;
			}

			// If none of the above did find anything simply return the
			// first parent node in the list
			return this.nodes[nodeNames[0]];
		}

		return this.__getStartNode(Object.keys(this.nodes));
	}



	/**
	 * Returns the resolved node parameter value. If it is an expression it will execute it and
	 * return the result. If the value to resolve is an array or object it will do the same
	 * for all of the items and values.
	 *
	 * @param {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[])} parameterValue
	 * @param {(IRunExecutionData | null)} runExecutionData
	 * @param {number} runIndex
	 * @param {number} itemIndex
	 * @param {string} activeNodeName
	 * @param {INodeExecutionData[]} connectionInputData
	 * @param {boolean} [returnObjectAsString=false]
	 * @returns {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[])}
	 * @memberof Workflow
	 */
	getParameterValue(parameterValue: NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[], runExecutionData: IRunExecutionData | null, runIndex: number, itemIndex: number, activeNodeName: string, connectionInputData: INodeExecutionData[], returnObjectAsString = false): NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[] {
		// Helper function which returns true when the parameter is a complex one or array
		const isComplexParameter = (value: NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[]) => {
			return typeof value === 'object';
		};

		// Helper function which resolves a parameter value depending on if it is simply or not
		const resolveParameterValue = (value: NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[]) => {
			if (isComplexParameter(value)) {
				return this.getParameterValue(value, runExecutionData, runIndex, itemIndex, activeNodeName, connectionInputData, returnObjectAsString);
			} else {
				return this.resolveSimpleParameterValue(value as NodeParameterValue, runExecutionData, runIndex, itemIndex, activeNodeName, connectionInputData, returnObjectAsString);
			}
		};

		// Check if it value is a simple one that we can get it resolved directly
		if (!isComplexParameter(parameterValue)) {
			return this.resolveSimpleParameterValue(parameterValue as NodeParameterValue, runExecutionData, runIndex, itemIndex, activeNodeName, connectionInputData, returnObjectAsString);
		}

		// The parameter value is complex so resolve depending on type

		if (Array.isArray(parameterValue)) {
			// Data is an array
			const returnData = [];
			for (const item of parameterValue) {
				returnData.push(resolveParameterValue(item));
			}

			if (returnObjectAsString === true && typeof returnData === 'object') {
				return this.convertObjectValueToString(returnData);
			}

			return returnData as NodeParameterValue[] | INodeParameters[];
		} else {
			// Data is an object
			const returnData: INodeParameters = {};
			for (const key of Object.keys(parameterValue)) {
				returnData[key] = resolveParameterValue((parameterValue as INodeParameters)[key]);
			}

			if (returnObjectAsString === true && typeof returnData === 'object') {
				return this.convertObjectValueToString(returnData);
			}
			return returnData;
		}
	}



	/**
	 * Resolves the paramter value.  If it is an expression it will execute it and
	 * return the result. For everything simply the supplied value will be returned.
	 *
	 * @param {NodeParameterValue} parameterValue
	 * @param {(IRunExecutionData | null)} runExecutionData
	 * @param {number} runIndex
	 * @param {number} itemIndex
	 * @param {string} activeNodeName
	 * @param {INodeExecutionData[]} connectionInputData
	 * @param {boolean} [returnObjectAsString=false]
	 * @returns {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[])}
	 * @memberof Workflow
	 */
	resolveSimpleParameterValue(parameterValue: NodeParameterValue, runExecutionData: IRunExecutionData | null, runIndex: number, itemIndex: number, activeNodeName: string, connectionInputData: INodeExecutionData[], returnObjectAsString = false): NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[] {
		// Check if it is an expression
		if (typeof parameterValue !== 'string' || parameterValue.charAt(0) !== '=') {
			// Is no expression so return value
			return parameterValue;
		}

		// Is an expression

		// Remove the equal sign
		parameterValue = parameterValue.substr(1);

		// Generate a data proxy which allows to query workflow data
		const dataProxy = new WorkflowDataProxy(this, runExecutionData, runIndex, itemIndex, activeNodeName, connectionInputData);
		const data = dataProxy.getDataProxy();

		// Execute the expression
		try {
			const returnValue = tmpl.tmpl(parameterValue, data);
			if (typeof returnValue === 'function') {
				throw new Error('Expression resolved to a function. Please add "()"');
			} else if (returnValue !== null && typeof returnValue === 'object') {
				if (returnObjectAsString === true)  {
					return this.convertObjectValueToString(returnValue);
				}
			}
			return returnValue;
		} catch (e) {
			throw new Error(`Expression is not valid: ${e.message}`);
		}
	}



	/**
	 * Executes the Webhooks method of the node
	 *
	 * @param {WebhookSetupMethodNames} method The name of the method to execute
	 * @param {IWebhookData} webhookData
	 * @param {INodeExecuteFunctions} nodeExecuteFunctions
	 * @param {WorkflowExecuteMode} mode
	 * @returns {(Promise<boolean | undefined>)}
	 * @memberof Workflow
	 */
	async runWebhookMethod(method: WebhookSetupMethodNames, webhookData: IWebhookData, nodeExecuteFunctions: INodeExecuteFunctions, mode: WorkflowExecuteMode, isTest?: boolean): Promise<boolean | undefined> {
		const node = this.getNode(webhookData.node) as INode;
		const nodeType = this.nodeTypes.getByName(node.type) as INodeType;


		if (nodeType.webhookMethods === undefined) {
			return;
		}

		if (nodeType.webhookMethods[webhookData.webhookDescription.name] === undefined) {
			return;
		}

		if (nodeType.webhookMethods[webhookData.webhookDescription.name][method] === undefined) {
			return;
		}

		const thisArgs = nodeExecuteFunctions.getExecuteHookFunctions(this, node, webhookData.workflowExecuteAdditionalData, mode, isTest, webhookData);
		return nodeType.webhookMethods[webhookData.webhookDescription.name][method]!.call(thisArgs);
	}


	/**
	 * Runs the given trigger node so that it can trigger the workflow
	 * when the node has data.
	 *
	 * @param {INode} node
	 * @param {IGetExecuteTriggerFunctions} getTriggerFunctions
	 * @param {IWorkflowExecuteAdditionalData} additionalData
	 * @param {WorkflowExecuteMode} mode
	 * @returns {(Promise<ITriggerResponse | undefined>)}
	 * @memberof Workflow
	 */
	async runTrigger(node: INode, getTriggerFunctions: IGetExecuteTriggerFunctions, additionalData: IWorkflowExecuteAdditionalData, mode: WorkflowExecuteMode): Promise<ITriggerResponse | undefined> {
		const triggerFunctions = getTriggerFunctions(this, node, additionalData, mode);

		const nodeType = this.nodeTypes.getByName(node.type);

		if (nodeType === undefined) {
			throw new Error(`The node type "${node.type}" of node "${node.name}" is not known.`);
		}

		if (!nodeType.trigger) {
			throw new Error(`The node type "${node.type}" of node "${node.name}" does not have a trigger function defined.`);
		}

		if (mode === 'manual') {
			// In manual mode we do not just start the trigger function we also
			// want to be able to get informed as soon as the first data got emitted
			const triggerResponse = await nodeType.trigger!.call(triggerFunctions);

			// Add the manual trigger response which resolves when the first time data got emitted
			triggerResponse!.manualTriggerResponse = new Promise((resolve) => {
				triggerFunctions.emit = ((resolve) => (data: INodeExecutionData[][]) => {
					resolve(data);
				})(resolve);
			});

			return triggerResponse;
		} else {
			// In all other modes simply start the trigger
			return nodeType.trigger!.call(triggerFunctions);
		}
	}


	/**
	 * Runs the given trigger node so that it can trigger the workflow
	 * when the node has data.
	 *
	 * @param {INode} node
	 * @param {IPollFunctions} pollFunctions
	 * @returns
	 * @memberof Workflow
	 */
	async runPoll(node: INode, pollFunctions: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const nodeType = this.nodeTypes.getByName(node.type);

		if (nodeType === undefined) {
			throw new Error(`The node type "${node.type}" of node "${node.name}" is not known.`);
		}

		if (!nodeType.poll) {
			throw new Error(`The node type "${node.type}" of node "${node.name}" does not have a poll function defined.`);
		}

		return nodeType.poll!.call(pollFunctions);
	}


	/**
	 * Executes the webhook data to see what it should return and if the
	 * workflow should be started or not
	 *
	 * @param {INode} node
	 * @param {IWorkflowExecuteAdditionalData} additionalData
	 * @param {INodeExecuteFunctions} nodeExecuteFunctions
	 * @param {WorkflowExecuteMode} mode
	 * @returns {Promise<IWebhookResponseData>}
	 * @memberof Workflow
	 */
	async runWebhook(webhookData: IWebhookData, node: INode, additionalData: IWorkflowExecuteAdditionalData, nodeExecuteFunctions: INodeExecuteFunctions, mode: WorkflowExecuteMode): Promise<IWebhookResponseData> {
		const nodeType = this.nodeTypes.getByName(node.type);
		if (nodeType === undefined) {
			throw new Error(`The type of the webhook node "${node.name}" is not known.`);
		} else if (nodeType.webhook === undefined) {
			throw new Error(`The node "${node.name}" does not have any webhooks defined.`);
		}

		const thisArgs = nodeExecuteFunctions.getExecuteWebhookFunctions(this, node, additionalData, mode, webhookData);
		return nodeType.webhook.call(thisArgs);
	}


	/**
	 * Executes the given node.
	 *
	 * @param {INode} node
	 * @param {ITaskDataConnections} inputData
	 * @param {IRunExecutionData} runExecutionData
	 * @param {number} runIndex
	 * @param {IWorkflowExecuteAdditionalData} additionalData
	 * @param {INodeExecuteFunctions} nodeExecuteFunctions
	 * @param {WorkflowExecuteMode} mode
	 * @returns {(Promise<INodeExecutionData[][] | null>)}
	 * @memberof Workflow
	 */
	async runNode(node: INode, inputData: ITaskDataConnections, runExecutionData: IRunExecutionData, runIndex: number, additionalData: IWorkflowExecuteAdditionalData, nodeExecuteFunctions: INodeExecuteFunctions, mode: WorkflowExecuteMode): Promise<INodeExecutionData[][] | null | undefined> {
		if (node.disabled === true) {
			// If node is disabled simply pass the data through
			// return NodeRunHelpers.
			if (inputData.hasOwnProperty('main') && inputData.main.length > 0) {
				// If the node is disabled simply return the data from the first main input
				if (inputData.main[0] === null) {
					return undefined;
				}
				return [(inputData.main[0] as INodeExecutionData[])];
			}
			return undefined;
		}

		const nodeType = this.nodeTypes.getByName(node.type);
		if (nodeType === undefined) {
			throw new Error(`Node type "${node.type}" is not known so can not run it!`);
		}

		let connectionInputData: INodeExecutionData[] = [];
		if (inputData.hasOwnProperty('main') && inputData.main.length > 0) {
			// We always use the data of main input and the first input for executeSingle
			connectionInputData = (inputData.main[0] as INodeExecutionData[]);
		}

		if (connectionInputData.length === 0) {
			// No data for node so return
			return undefined;
		}

		if (runExecutionData.resultData.lastNodeExecuted === node.name && runExecutionData.resultData.error !== undefined) {
			// The node did already fail. So throw an error here that it displays and logs it correctly.
			// Does get used by webhook and trigger nodes in case they throw an error that it is possible
			// to log the error and display in Editor-UI.
			const error = new Error(runExecutionData.resultData.error.message);
			error.stack = runExecutionData.resultData.error.stack;
			throw error;
		}

		if (node.executeOnce === true) {
			// If node should be executed only use only the first input item
			connectionInputData = connectionInputData.slice(0, 1);
			const newInputData: ITaskDataConnections = {};
			for (const inputName of Object.keys(inputData)) {
				newInputData[inputName] = inputData[inputName].map(input => {
					return input && input.slice(0, 1);
				});
			}
			inputData = newInputData;
		}

		if (nodeType.executeSingle) {
			const returnPromises: Array<Promise<INodeExecutionData>> = [];

			for (let itemIndex = 0; itemIndex < connectionInputData.length; itemIndex++) {
				const thisArgs = nodeExecuteFunctions.getExecuteSingleFunctions(this, runExecutionData, runIndex, connectionInputData, inputData, node, itemIndex, additionalData, mode);

				returnPromises.push(nodeType.executeSingle!.call(thisArgs));
			}

			if (returnPromises.length === 0) {
				return null;
			}

			let promiseResults;
			try {
				promiseResults = await Promise.all(returnPromises);
			} catch (error) {
				return Promise.reject(error);
			}

			if (promiseResults) {
				return [promiseResults];
			}
		} else if (nodeType.execute) {
			const thisArgs = nodeExecuteFunctions.getExecuteFunctions(this, runExecutionData, runIndex, connectionInputData, inputData, node, additionalData, mode);
			return nodeType.execute.call(thisArgs);
		} else if (nodeType.poll) {
			const thisArgs = nodeExecuteFunctions.getExecutePollFunctions(this, node, additionalData, mode);
			return nodeType.poll.call(thisArgs);
		} else if (nodeType.trigger) {
			if (mode === 'manual') {
				// In manual mode start the trigger
				const triggerResponse = await this.runTrigger(node, nodeExecuteFunctions.getExecuteTriggerFunctions, additionalData, mode);

				if (triggerResponse === undefined) {
					return null;
				}

				if (triggerResponse.manualTriggerFunction !== undefined) {
					// If a manual trigger function is defined call it and wait till it did run
					await triggerResponse.manualTriggerFunction();
				}

				const response = await triggerResponse.manualTriggerResponse!;

				// And then close it again after it did execute
				if (triggerResponse.closeFunction) {
					await triggerResponse.closeFunction();
				}

				if (response.length === 0) {
					return null;
				}

				return response;
			} else {
				// For trigger nodes in any mode except "manual" do we simply pass the data through
				return NodeHelpers.prepareOutputData(connectionInputData);
			}

		} else if (nodeType.webhook) {
			// For webhook nodes always simply pass the data through
			return NodeHelpers.prepareOutputData(connectionInputData);
		}

		return null;
	}
}