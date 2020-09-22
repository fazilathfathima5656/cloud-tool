import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class MattermostApi implements ICredentialType {
	name = 'mattermostApi';
	displayName = 'Mattermost API';
	documentationUrl = 'mattermost';
	properties = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
