import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class OpenWeatherMapApi implements ICredentialType {
	name = 'openWeatherMapApi';
	displayName = 'OpenWeatherMap API';
	documentationUrl = 'openWeatherMap';
	properties = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
