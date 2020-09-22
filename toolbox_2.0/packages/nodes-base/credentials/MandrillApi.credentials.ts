import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class MandrillApi implements ICredentialType {
	name = 'mandrillApi';
	displayName = 'Mandrill API';
	documentationUrl = 'mandrill';
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
