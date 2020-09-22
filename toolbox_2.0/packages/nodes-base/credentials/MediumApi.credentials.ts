import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class MediumApi implements ICredentialType {
	name = 'mediumApi';
	displayName = 'Medium API';
	documentationUrl = 'medium';
	properties = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
