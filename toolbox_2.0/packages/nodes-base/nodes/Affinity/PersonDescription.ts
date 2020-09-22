import { INodeProperties } from '@toolbox/toolbox-workflow';

export const personOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'person',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a person',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a person',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a person',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all persons',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a person',
			},
		],
		default: 'create',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

export const personFields = [

/* -------------------------------------------------------------------------- */
/*                                person:create                               */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Fist Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'person',
				],
				operation: [
					'create',
				]
			},
		},
		description: 'The first name of the person.',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'person',
				],
				operation: [
					'create',
				]
			},
		},
		description: 'The last name of the person.',
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
					'person',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Organizations',
				name: 'organizations',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getOrganizations',
				},
				default: [],
				description: 'Organizations that the person is associated with.',
			},
		],
	},
	{
		displayName: 'Emails',
		name: 'emails',
		type: 'string',
		description: 'The email addresses of the person',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add To Email',
		},
		displayOptions: {
			show: {
				resource: [
					'person',
				],
				operation: [
					'create',
				]
			},
		},
		placeholder: 'info@example.com',
		default: [],
	},
/* -------------------------------------------------------------------------- */
/*                                 person:update                              */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'person',
				],
				operation: [
					'update',
				]
			},
		},
		description: 'Unique identifier for the person.',
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
					'person',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Fist Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'The first name of the person.',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'The last name of the person.',
			},
			{
				displayName: 'Organizations',
				name: 'organizations',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getOrganizations',
				},
				default: [],
				description: 'Organizations that the person is associated with.',
			},
		]
	},
	{
		displayName: 'Emails',
		name: 'emails',
		type: 'string',
		description: 'The email addresses of the person',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add To Email',
		},
		displayOptions: {
			show: {
				resource: [
					'person',
				],
				operation: [
					'update',
				]
			},
		},
		placeholder: 'info@example.com',
		default: [],
	},
/* -------------------------------------------------------------------------- */
/*                                 person:get                                 */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'person',
				],
				operation: [
					'get',
				]
			},
		},
		description: 'Unique identifier for the person.',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'person',
				],
				operation: [
					'get',
				],
			},
		},
		options: [
			{
				displayName: 'With Interaction Dates',
				name: 'withInteractionDates',
				type: 'boolean',
				default: false,
				description: 'When true, interaction dates will be present on the returned resources.',
			},
		]
	},
/* -------------------------------------------------------------------------- */
/*                                 person:getAll                              */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: [
					'person',
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
					'person',
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
			maxValue: 10,
		},
		default: 5,
		description: 'How many results to return.',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'person',
				],
				operation: [
					'getAll',
				],
			},
		},
		options: [
			{
				displayName: 'Term',
				name: 'term',
				type: 'string',
				default: '',
				description: 'A string used to search all the persons in your team’s address book. This could be an email address, a first name or a last name.',
			},
			{
				displayName: 'With Interaction Dates',
				name: 'withInteractionDates',
				type: 'boolean',
				default: false,
				description: 'When true, interaction dates will be present on the returned resources.',
			},
		]
	},
/* -------------------------------------------------------------------------- */
/*                                 person:delete                              */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'person',
				],
				operation: [
					'delete',
				]
			},
		},
		description: 'Unique identifier for the person.',
	},
] as INodeProperties[];
