import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class GitlabApi implements ICredentialType {
	name = 'gitlabApi';
	displayName = 'Gitlab API';
	documentationUrl = 'gitlab';
	properties = [
		{
			displayName: 'Gitlab Server',
			name: 'server',
			type: 'string' as NodePropertyTypes,
			default: 'https://gitlab.com'
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
