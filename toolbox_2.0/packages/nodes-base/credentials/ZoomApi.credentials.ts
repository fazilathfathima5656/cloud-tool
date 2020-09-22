import { ICredentialType, NodePropertyTypes } from '@toolbox/toolbox-workflow';

export class ZoomApi implements ICredentialType {
	name = 'zoomApi';
	displayName = 'Zoom API';
	documentationUrl = 'zoom';
	properties = [
		{
			displayName: 'JWT Token',
			name: 'accessToken',
			type: 'string' as NodePropertyTypes,
			default: ''
		}
	];
}
