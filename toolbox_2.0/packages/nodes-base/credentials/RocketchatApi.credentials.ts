import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';


export class RocketchatApi implements ICredentialType {
	name = 'rocketchatApi';
	displayName = 'Rocket API';
	documentationUrl = 'rocketchat';
	properties = [
		{
			displayName: 'User Id',
			name: 'userId',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'Auth Key',
			name: 'authKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string' as NodePropertyTypes,
			default: '',
			placeholder: 'https://toolbox.rocket.chat',
		},
	];
}
