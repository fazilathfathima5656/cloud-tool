import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class BannerbearApi implements ICredentialType {
	name = 'bannerbearApi';
	displayName = 'Bannerbear API';
	documentationUrl = 'bannerbear';
	properties = [
		{
			displayName: 'Project API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
