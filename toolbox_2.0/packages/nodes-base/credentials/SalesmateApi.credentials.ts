import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class SalesmateApi implements ICredentialType {
	name = 'salesmateApi';
	displayName = 'Salesmate API';
	documentationUrl = 'salesmate';
	properties = [
		{
			displayName: 'Session Token',
			name: 'sessionToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'URL',
			name: 'url',
			type: 'string' as NodePropertyTypes,
			default: '',
			placeholder: 'toolbox.salesmate.io',
		},
	];
}
