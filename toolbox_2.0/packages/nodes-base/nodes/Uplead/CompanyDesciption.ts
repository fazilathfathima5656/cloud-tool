import { INodeProperties } from '@toolbox/toolbox-workflow';

export const companyOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'company',
				],
			},
		},
		options: [
			{
				name: 'Enrich',
				value: 'enrich',
			},
		],
		default: 'enrich',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

export const companyFields = [

/* -------------------------------------------------------------------------- */
/*                                 company:enrich                             */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Company',
		name: 'company',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'company',
				],
				operation: [
					'enrich',
				],
			},
		},
		description: 'the name of the company (e.g – amazon)',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'company',
				],
				operation: [
					'enrich',
				],
			},
		},
		description: 'the domain name (e.g – amazon.com)',
	},
] as INodeProperties[];
