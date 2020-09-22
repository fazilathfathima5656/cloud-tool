import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class HubspotApi implements ICredentialType {
	name = 'hubspotApi';
	displayName = 'Hubspot API';
	documentationUrl = 'hubspot';
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
