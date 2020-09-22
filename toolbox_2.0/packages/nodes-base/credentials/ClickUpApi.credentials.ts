import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class ClickUpApi implements ICredentialType {
	name = 'clickUpApi';
	displayName = 'ClickUp API';
	documentationUrl = 'clickUp';
	properties = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
