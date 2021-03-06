import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class TogglApi implements ICredentialType {
	name = 'togglApi';
	displayName = 'Toggl API';
	documentationUrl = 'toggl';
	properties = [
		{
			displayName: 'Username',
			name: 'username',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
