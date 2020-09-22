import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class MondayComApi implements ICredentialType {
	name = 'mondayComApi';
	displayName = 'Monday.com API';
	documentationUrl = 'mondayCom';
	properties = [
		{
			displayName: 'Token V2',
			name: 'apiToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
