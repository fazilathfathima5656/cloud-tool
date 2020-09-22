import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class TravisCiApi implements ICredentialType {
	name = 'travisCiApi';
	displayName = 'Travis API';
	documentationUrl = 'travisCi';
	properties = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
