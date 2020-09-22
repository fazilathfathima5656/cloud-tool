import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class CustomerIoApi implements ICredentialType {
	name = 'customerIoApi';
	displayName = 'Customer.io API';
	documentationUrl = 'customerIo';
	properties = [
		{
			displayName: 'App API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},

	];
}
