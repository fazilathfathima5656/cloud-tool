import {
	INodeProperties,
 } from '@toolbox/toolbox-workflow';

export const checklistItemOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'checklistItem',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a checklist item',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a checklist item',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a checklist item',
			},
		],
		default: 'create',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

export const checklistItemFields = [

/* -------------------------------------------------------------------------- */
/*                                checklistItem:create                        */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Checklist ID',
		name: 'checklist',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'checklistItem',
				],
				operation: [
					'create',
				],
			},
		},
		required: true,
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'checklistItem',
				],
				operation: [
					'create',
				],
			},
		},
		required: true,
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
					'checklistItem',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Assignee ID',
				name: 'assignee',
				type: 'string',
				default: '',
			},
		],
	},
/* -------------------------------------------------------------------------- */
/*                                checklistItem:delete                        */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Checklist ID',
		name: 'checklist',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'checklistItem',
				],
				operation: [
					'delete',
				],
			},
		},
		required: true,
	},
	{
		displayName: 'Checklist Item ID',
		name: 'checklistItem',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'checklistItem',
				],
				operation: [
					'delete',
				],
			},
		},
		required: true,
	},
/* -------------------------------------------------------------------------- */
/*                                checklistItem:update                        */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Checklist ID',
		name: 'checklist',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'checklistItem',
				],
				operation: [
					'update',
				],
			},
		},
		required: true,
	},
	{
		displayName: 'Checklist Item ID',
		name: 'checklistItem',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'checklistItem',
				],
				operation: [
					'update',
				],
			},
		},
		required: true,
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
					'checklistItem',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Assignee ID',
				name: 'assignee',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Parent Checklist Item ID',
				name: 'parent',
				type: 'string',
				default: '',
				description: 'Checklist item that you want to nest the target checklist item underneath.',
			},
			{
				displayName: 'Resolved',
				name: 'resolved',
				type: 'boolean',
				default: false,
			},
		],
	},
] as INodeProperties[];
