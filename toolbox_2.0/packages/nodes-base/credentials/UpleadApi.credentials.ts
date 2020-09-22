import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class UpleadApi implements ICredentialType {
	name = 'upleadApi';
	displayName = 'Uplead API';
	documentationUrl = 'uplead';
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
