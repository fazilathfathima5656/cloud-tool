import {
	IExecuteFunctions,
} from '@toolbox/toolbox-core';
import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from '@toolbox/toolbox-workflow';
import {
	upleadApiRequest,
} from './GenericFunctions';
import {
	companyFields,
	companyOperations,
} from './CompanyDesciption';
import {
	personOperations,
	 personFields,
} from './PersonDescription';

export class Uplead implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Uplead',
		name: 'uplead',
		icon: 'file:uplead.png',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
		description: 'Consume Uplead API',
		defaults: {
			name: 'Uplead',
			color: '#5d6f7b',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'upleadApi',
				required: true,
			}
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Company',
						value: 'company',
						description: 'Company API lets you lookup company data via a domain name or company name.',
					},
					{
						name: 'Person',
						value: 'person',
						description: `Person API lets you lookup a person based on an email address OR based on a domain name + first name + last name`
					},
				],
				default: 'company',
				description: 'Resource to consume.',
			},
			...companyOperations,
			...companyFields,
			...personOperations,
			...personFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length as unknown as number;
		const qs: IDataObject = {};
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		for (let i = 0; i < length; i++) {
			if (resource === 'person') {
				if (operation === 'enrich') {
					const email = this.getNodeParameter('email', i) as string;
					const firstname = this.getNodeParameter('firstname', i) as string;
					const lastname = this.getNodeParameter('lastname', i) as string;
					const domain = this.getNodeParameter('domain', i) as string;
					if (email) {
						qs.email = email;
					}
					if (firstname) {
						qs.first_name = firstname;
					}
					if (lastname) {
						qs.last_name = lastname;
					}
					if (domain) {
						qs.domain = domain;
					}
					responseData = await upleadApiRequest.call(this, 'GET', '/person-search', {}, qs);
				}
			}
			if (resource === 'company') {
				if (operation === 'enrich') {
					const domain = this.getNodeParameter('domain', i) as string;
					const company = this.getNodeParameter('company', i) as string;
					if (domain) {
						qs.domain = domain;
					}
					if (company) {
						qs.company = company;
					}
					responseData = await upleadApiRequest.call(this, 'GET', '/company-search', {}, qs);
				}
			}
			if (Array.isArray(responseData.data)) {
				returnData.push.apply(returnData, responseData.data as IDataObject[]);
			} else {
				if (responseData.data !== null) {
					returnData.push(responseData.data as IDataObject);
				}
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
