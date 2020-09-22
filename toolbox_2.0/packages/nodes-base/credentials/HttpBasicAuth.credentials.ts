import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class HttpBasicAuth implements ICredentialType {
	name = 'httpBasicAuth';
	displayName = 'Basic Auth';
	documentationUrl = 'httpRequest';
	properties = [
		{
			displayName: 'User',
			name: 'user',
			type: 'string' as NodePropertyTypes,
			default: '',

		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string' as NodePropertyTypes,
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
