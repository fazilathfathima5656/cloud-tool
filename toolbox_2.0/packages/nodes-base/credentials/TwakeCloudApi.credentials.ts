import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

export class TwakeCloudApi implements ICredentialType {
	name = 'twakeCloudApi';
	displayName = 'Twake API';
	documentationUrl = 'twake';
	properties = [
		{
			displayName: 'Workspace Key',
			name: 'workspaceKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
