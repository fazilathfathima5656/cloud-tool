import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class GumroadApi implements ICredentialType {
	name = 'gumroadApi';
	displayName = 'Gumroad API';
	documentationUrl = 'gumroad';
	properties = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
