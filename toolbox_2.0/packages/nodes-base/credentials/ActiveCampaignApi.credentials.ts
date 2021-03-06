import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class ActiveCampaignApi implements ICredentialType {
	name = 'activeCampaignApi';
	displayName = 'ActiveCampaign API';
	documentationUrl = 'activeCampaign';
	properties = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
