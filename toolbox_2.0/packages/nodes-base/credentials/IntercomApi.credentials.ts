import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class IntercomApi implements ICredentialType {
	name = 'intercomApi';
	displayName = 'Intercom API';
	documentationUrl = 'intercom';
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
