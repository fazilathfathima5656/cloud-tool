import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class FacebookGraphApi implements ICredentialType {
	name = 'facebookGraphApi';
	displayName = 'Facebook Graph API';
	documentationUrl = 'facebookGraph';
	properties = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
