import { ICredentialType, NodePropertyTypes } from '@toolbox/toolbox-workflow';

export class MessageBirdApi implements ICredentialType {
	name = 'messageBirdApi';
	displayName = 'MessageBird API';
	documentationUrl = 'messageBird';
	properties = [
		{
			displayName: 'API Key',
			name: 'accessKey',
			type: 'string' as NodePropertyTypes,
			default: ''
		}
	];
}
