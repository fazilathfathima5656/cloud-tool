import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class PagerDutyApi implements ICredentialType {
	name = 'pagerDutyApi';
	displayName = 'PagerDuty API';
	documentationUrl = 'pagerDuty';
	properties = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
