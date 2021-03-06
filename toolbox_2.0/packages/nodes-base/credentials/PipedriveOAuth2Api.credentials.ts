import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class PipedriveOAuth2Api implements ICredentialType {
	name = 'pipedriveOAuth2Api';
	extends = [
		'oAuth2Api',
	];
	displayName = 'Pipedrive OAuth2 API';
	documentationUrl = 'pipedrive';
	properties = [
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden' as NodePropertyTypes,
			default: 'https://oauth.pipedrive.com/oauth/authorize',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden' as NodePropertyTypes,
			default: 'https://oauth.pipedrive.com/oauth/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden' as NodePropertyTypes,
			default: 'header',
		},
	];
}
