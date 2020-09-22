import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class HunterApi implements ICredentialType {
	name = 'hunterApi';
	displayName = 'Hunter API';
	documentationUrl = 'hunter';
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
