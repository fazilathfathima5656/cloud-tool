import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class ClearbitApi implements ICredentialType {
	name = 'clearbitApi';
	displayName = 'Clearbit API';
	documentationUrl = 'clearbit';
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
