import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class ChargebeeApi implements ICredentialType {
	name = 'chargebeeApi';
	displayName = 'Chargebee API';
	documentationUrl = 'chargebee';
	properties = [
		{
			displayName: 'Account Name',
			name: 'accountName',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'Api Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
