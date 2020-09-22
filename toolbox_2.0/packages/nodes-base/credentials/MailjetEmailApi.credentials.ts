import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class MailjetEmailApi implements ICredentialType {
	name = 'mailjetEmailApi';
	displayName = 'Mailjet Email API';
	documentationUrl = 'mailjet';
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
