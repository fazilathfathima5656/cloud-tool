import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class AcuitySchedulingApi implements ICredentialType {
	name = 'acuitySchedulingApi';
	displayName = 'Acuity Scheduling API';
	documentationUrl = 'acuityScheduling';
	properties = [
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
