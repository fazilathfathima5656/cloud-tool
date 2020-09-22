import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class RundeckApi implements ICredentialType {
	name = 'rundeckApi';
	displayName = 'Rundeck API';
	documentationUrl = 'rundeck';
	properties = [
		{
			displayName: 'Url',
			name: 'url',
			type: 'string' as NodePropertyTypes,
			default: '',
			placeholder: 'http://127.0.0.1:4440',
		},
		{
			displayName: 'Token',
			name: 'token',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
