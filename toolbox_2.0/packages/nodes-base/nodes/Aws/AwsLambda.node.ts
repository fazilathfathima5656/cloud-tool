import { IExecuteFunctions } from '@toolbox/toolbox-core';
import {
	INodeTypeDescription,
	INodeExecutionData,
	INodeType,
	INodePropertyOptions,
	ILoadOptionsFunctions,
	IDataObject
} from '@toolbox/toolbox-workflow';

import { awsApiRequestREST } from './GenericFunctions';

export class AwsLambda implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AWS Lambda',
		name: 'awsLambda',
		icon: 'file:lambda.png',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["function"]}}',
		description: 'Invoke functions on AWS Lambda',
		defaults: {
			name: 'AWS Lambda',
			color: '#FF9900',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'aws',
				required: true,
			}
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Invoke',
						value: 'invoke',
						description: 'Invoke a function',
					},
				],
				default: 'invoke',
				description: 'The operation to perform.',
			},
			{
				displayName: 'Function',
				name: 'function',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getFunctions',
				},
				displayOptions: {
					show: {
						operation: [
							'invoke',
						],
					},
				},
				options: [],
				default: '',
				required: true,
				description: 'The function you want to invoke',
			},
			{
				displayName: 'Qualifier',
				name: 'qualifier',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'invoke',
						],
					},
				},
				required: true,
				default: '$LATEST',
				description: 'Specify a version or alias to invoke a published version of the function',
			},
			{
				displayName: 'Invocation Type',
				name: 'invocationType',
				type: 'options',
				options: [
					{
						name: 'Wait for results',
						value: 'RequestResponse',
						description: 'Invoke the function synchronously and wait for the response',
					},
					{
						name: 'Continue workflow',
						value: 'Event',
						description: 'Invoke the function and immediately continue the workflow',
					},
				],
				displayOptions: {
					show: {
						operation: [
							'invoke',
						],
					},
				},
				default: 'RequestResponse',
				description: 'Specify if the workflow should wait for the function to return the results',
			},
			{
				displayName: 'JSON Input',
				name: 'payload',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'invoke',
						],
					},
				},
				default: '',
				description: 'The JSON that you want to provide to your Lambda function as input',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
			},
		],
	};

	methods = {
		loadOptions: {
			async getFunctions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				let data;
				try {
					data = await awsApiRequestREST.call(this, 'lambda', 'GET', '/2015-03-31/functions/');
				} catch (err) {
					throw new Error(`AWS Error: ${err}`);
				}

				for (const func of data.Functions!) {
					returnData.push({
						name: func.FunctionName as string,
						value: func.FunctionArn as string,
					});
				}
				return returnData;
			}
		},
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		for (let i = 0; i < items.length; i++) {
			const params = {
				FunctionName: this.getNodeParameter('function', i) as string,
				InvocationType: this.getNodeParameter('invocationType', i) as string,
				Payload: this.getNodeParameter('payload', i) as string,
				Qualifier: this.getNodeParameter('qualifier', i) as string,
			};

			let responseData;
			try {
				responseData = await awsApiRequestREST.call(
					this,
					'lambda',
					'POST',
					`/2015-03-31/functions/${params.FunctionName}/invocations?Qualifier=${params.Qualifier}`,
					params.Payload,
					{
						'X-Amz-Invocation-Type': params.InvocationType,
						'Content-Type': 'application/x-amz-json-1.0',
					},
				);
			} catch (err) {
				throw new Error(`AWS Error: ${err}`);
			}

			if (responseData !== null && responseData.errorMessage !== undefined) {
				let errorMessage = responseData.errorMessage;

				if (responseData.stackTrace) {
					errorMessage += `\n\nStack trace:\n${responseData.stackTrace}`;
				}

				throw new Error(errorMessage);
			} else {
				returnData.push({
					result: responseData,
				} as IDataObject);
			}

		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
