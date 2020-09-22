import { INodeProperties } from '@toolbox/toolbox-workflow';

export const accountOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
			},
		},
		options: [
			{
				name: 'Add Note',
				value: 'addNote',
				description: 'Add note to an account',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create an account',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an account',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all accounts',
			},
			{
				name: 'Get Summary',
				value: 'getSummary',
				description: `Returns an overview of account's metadata.`,
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an account',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an account',
			},
		],
		default: 'create',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

export const accountFields = [

/* -------------------------------------------------------------------------- */
/*                                account:create                              */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'create',
				]
			},
		},
		description: 'Name of the account. Maximum size is 255 characters.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Account Source',
				name: 'accountSource',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAccountSources',
				},
				default: '',
				description: 'The source of the account record',
			},
			{
				displayName: 'Annual Revenue',
				name: 'annualRevenue',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: '',
				description: 'Estimated annual revenue of the account.',
			},
			{
				displayName: 'Billing City',
				name: 'billingCity',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 40 characters.',
			},
			{
				displayName: 'Billing Country',
				name: 'billingCountry',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 80 characters.',
			},
			{
				displayName: 'Billing Postal Code',
				name: 'billingPostalCode',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 20 characters.',
			},
			{
				displayName: 'Billing State',
				name: 'billingState',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 80 characters.',
			},
			{
				displayName: 'Billing Street',
				name: 'billingStreet',
				type: 'string',
				default: '',
				description: 'Street address for the billing address of this account.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: 'Text description of the account. Limited to 32,000 KB.',
			},
			{
				displayName: 'Fax',
				name: 'fax',
				type: 'string',
				default: '',
				description: 'Fax number for the account.',
			},
			{
				displayName: 'Jigsaw',
				name: 'jigsaw',
				type: 'string',
				default: '',
				description: 'references the ID of a company in Data.com',
			},
			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: '',
				description: 'The website of this account. Maximum of 255 characters.',
			},
			{
				displayName: 'Number Of Employees',
				name: 'numberOfEmployees',
				type: 'integer',
				default: '',
				description: 'Number of employees',
			},
			{
				displayName: 'Owner',
				name: 'owner',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				default: '',
				description: 'The owner of the account.',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number for the account.',
			},
			{
				displayName: 'SicDesc',
				name: 'sicDesc',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				description: 'A brief description of an organization’s line of business, based on its SIC code.',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getAccountTypes',
				},
				description: 'Type of account',
			},
			{
				displayName: 'Parent Id',
				name: 'parentId',
				type: 'string',
				default: '',
				description: 'ID of the parent object, if any.',
			},
			{
				displayName: 'Shipping City',
				name: 'shippingCity',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. City maximum size is 40 characters',
			},
			{
				displayName: 'Shipping Country',
				name: 'shippingCountry',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. Country maximum size is 80 characters.',
			},
			{
				displayName: 'Shipping Postal Code',
				name: 'shippingPostalCode',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. Postal code maximum size is 20 characters.',
			},
			{
				displayName: 'Shipping State',
				name: 'shippingState',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. State maximum size is 80 characters.',
			},
			{
				displayName: 'Shipping Street',
				name: 'shippingStreet',
				type: 'string',
				default: '',
				description: 'The street address of the shipping address for this account. Maximum of 255 characters.',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'The website of this account. Maximum of 255 characters.',
			},
		],
	},
/* -------------------------------------------------------------------------- */
/*                                 account:update                             */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'update',
				]
			},
		},
		description: 'Id of account that needs to be fetched',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Account Source',
				name: 'accountSource',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAccountSources',
				},
				default: '',
				description: 'The source of the account record',
			},
			{
				displayName: 'Annual Revenue',
				name: 'annualRevenue',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: '',
				description: 'Estimated annual revenue of the account.',
			},
			{
				displayName: 'Billing City',
				name: 'billingCity',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 40 characters.',
			},
			{
				displayName: 'Billing Country',
				name: 'billingCountry',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 80 characters.',
			},
			{
				displayName: 'Billing Postal Code',
				name: 'billingPostalCode',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 20 characters.',
			},
			{
				displayName: 'Billing State',
				name: 'billingState',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 80 characters.',
			},
			{
				displayName: 'Billing Street',
				name: 'billingStreet',
				type: 'string',
				default: '',
				description: 'Street address for the billing address of this account.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: 'Text description of the account. Limited to 32,000 KB.',
			},
			{
				displayName: 'Fax',
				name: 'fax',
				type: 'string',
				default: '',
				description: 'Fax number for the account.',
			},
			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: '',
				description: 'The website of this account. Maximum of 255 characters.',
			},
			{
				displayName: 'Jigsaw',
				name: 'jigsaw',
				type: 'string',
				default: '',
				description: 'references the ID of a company in Data.com',
			},
			{
				displayName: 'Owner',
				name: 'ownerId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				default: '',
				description: 'The owner of the account.',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number for the account.',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getAccountTypes',
				},
				description: 'Type of account',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the account. Maximum size is 255 characters.',
			},
			{
				displayName: 'Number Of Employees',
				name: 'numberOfEmployees',
				type: 'integer',
				default: '',
				description: 'Number of employees',
			},
			{
				displayName: 'Parent Id',
				name: 'parentId',
				type: 'string',
				default: '',
				description: 'ID of the parent object, if any.',
			},
			{
				displayName: 'SicDesc',
				name: 'sicDesc',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				description: 'A brief description of an organization’s line of business, based on its SIC code.',
			},
			{
				displayName: 'Shipping City',
				name: 'shippingCity',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. City maximum size is 40 characters',
			},
			{
				displayName: 'Shipping Country',
				name: 'shippingCountry',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. Country maximum size is 80 characters.',
			},
			{
				displayName: 'Shipping Postal Code',
				name: 'shippingPostalCode',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. Postal code maximum size is 20 characters.',
			},
			{
				displayName: 'Shipping State',
				name: 'shippingState',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. State maximum size is 80 characters.',
			},
			{
				displayName: 'Shipping Street',
				name: 'shippingStreet',
				type: 'string',
				default: '',
				description: 'The street address of the shipping address for this account. Maximum of 255 characters.',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'The website of this account. Maximum of 255 characters.',
			},
		],
	},

/* -------------------------------------------------------------------------- */
/*                                  account:get                               */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'get',
				]
			},
		},
		description: 'Id of account that needs to be fetched',
	},
/* -------------------------------------------------------------------------- */
/*                                  account:delete                            */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'delete',
				]
			},
		},
		description: 'Id of account that needs to be fetched',
	},
/* -------------------------------------------------------------------------- */
/*                                 account:getAll                             */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'getAll',
				],
			},
		},
		default: false,
		description: 'If all results should be returned or only up to a given limit.',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'getAll',
				],
				returnAll: [
					false,
				],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'How many results to return.',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'getAll',
				],
			},
		},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'string',
				default: '',
				description: 'Fields to include separated by ,',
			},
		]
	},
/* -------------------------------------------------------------------------- */
/*                             account:addNote                                */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'addNote',
				]
			},
		},
		description: 'Id of account that needs to be fetched',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'addNote',
				]
			},
		},
		description: 'Title of the note.',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'addNote',
				],
			},
		},
		options: [
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				default: '',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				description: 'Body of the note. Limited to 32 KB.',
			},
			{
				displayName: 'Is Private',
				name: 'isPrivate',
				type: 'boolean',
				default: false,
				description: 'If true, only the note owner or a user with the “Modify All Data” permission can view the note or query it via the API',
			},
			{
				displayName: 'Owner',
				name: 'ownerId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				default: '',
				description: 'ID of the user who owns the note.',
			},
		]
	},
] as INodeProperties[];