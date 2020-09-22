import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class EventbriteApi implements ICredentialType {
	name = 'eventbriteApi';
	displayName = 'Eventbrite API';
	documentationUrl = 'eventbrite';
	properties = [
		{
			displayName: 'Private Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
