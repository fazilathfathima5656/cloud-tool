import { IExecuteFunctions } from '@toolbox/toolbox-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from '@toolbox/toolbox-workflow';


export class NoOp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'No Operation, do nothing',
		name: 'noOp',
		icon: 'fa:arrow-right',
		group: ['organization'],
		version: 1,
		description: 'No Operation',
		defaults: {
			name: 'NoOp',
			color: '#b0b0b0',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
		],
	};

	execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		return this.prepareOutputData(items);
	}
}
