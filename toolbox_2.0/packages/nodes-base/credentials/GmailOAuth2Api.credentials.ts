import {
	ICredentialType,
	NodePropertyTypes,
} from '@toolbox/toolbox-workflow';

const scopes = [
	'https://www.googleapis.com/auth/gmail.labels',
	'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
	'https://www.googleapis.com/auth/gmail.addons.current.message.action',
	'https://mail.google.com/',
	'https://www.googleapis.com/auth/gmail.modify',
	'https://www.googleapis.com/auth/gmail.compose',
];


export class GmailOAuth2Api implements ICredentialType {
	name = 'gmailOAuth2';
	extends = [
		'googleOAuth2Api',
	];
	displayName = 'Gmail OAuth2 API';
	properties = [
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden' as NodePropertyTypes,
			default: scopes.join(' '),
		},
	];
}
