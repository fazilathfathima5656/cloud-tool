import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class PostmarkApi implements ICredentialType {
	name = 'postmarkApi';
	displayName = 'Postmark API';
	documentationUrl = 'postmark';
	properties = [
		{
			displayName: 'Server API Token',
			name: 'serverToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
