import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class TypeformApi implements ICredentialType {
	name = 'typeformApi';
	displayName = 'Typeform API';
	documentationUrl = 'typeform';
	properties = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
