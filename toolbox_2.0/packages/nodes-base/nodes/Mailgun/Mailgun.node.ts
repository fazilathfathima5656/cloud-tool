import {
	BINARY_ENCODING,
	IExecuteSingleFunctions,
} from '@toolbox/toolbox-core';
import {
	IDataObject,
	INodeTypeDescription,
	INodeExecutionData,
	INodeType,
} from '@toolbox/toolbox-workflow';


export class Mailgun implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mailgun',
		name: 'mailgun',
		icon: 'file:mailgun.png',
		group: ['output'],
		version: 1,
		description: 'Sends an Email via Mailgun',
		defaults: {
			name: 'Mailgun',
			color: '#c02428',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'mailgunApi',
				required: true,
			}
		],
		properties: [
			{
				displayName: 'From Email',
				name: 'fromEmail',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'Admin <admin@example.com>',
				description: 'Email address of the sender optional with name.',
			},
			{
				displayName: 'To Email',
				name: 'toEmail',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'info@example.com',
				description: 'Email address of the recipient. Multiple ones can be separated by comma.',
			},
			{
				displayName: 'Cc Email',
				name: 'ccEmail',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'Cc Email address of the recipient. Multiple ones can be separated by comma.',
			},
			{
				displayName: 'Bcc Email',
				name: 'bccEmail',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'Bcc Email address of the recipient. Multiple ones can be separated by comma.',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				placeholder: 'My subject line',
				description: 'Subject line of the email.',
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
					rows: 5,
				},
				default: '',
				description: 'Plain text message of email.',
			},
			{
				displayName: 'HTML',
				name: 'html',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				description: 'HTML text message of email.',
			},
			{
				displayName: 'Attachments',
				name: 'attachments',
				type: 'string',
				default: '',
				description: 'Name of the binary properties which contain<br />data which should be added to email as attachment.<br />Multiple ones can be comma separated.',
			},
		],
	};


	async executeSingle(this: IExecuteSingleFunctions): Promise<INodeExecutionData> {
		const item = this.getInputData();

		const fromEmail = this.getNodeParameter('fromEmail') as string;
		const toEmail = this.getNodeParameter('toEmail') as string;
		const ccEmail = this.getNodeParameter('ccEmail') as string;
		const bccEmail = this.getNodeParameter('bccEmail') as string;
		const subject = this.getNodeParameter('subject') as string;
		const text = this.getNodeParameter('text') as string;
		const html = this.getNodeParameter('html') as string;
		const attachmentPropertyString = this.getNodeParameter('attachments') as string;

		const credentials = this.getCredentials('mailgunApi');

		if (credentials === undefined) {
			throw new Error('No credentials got returned!');
		}

		const formData: IDataObject = {
			from: fromEmail,
			to: toEmail,
			subject,
			text,
			html
		};

		if (ccEmail.length !== 0) {
			formData.cc = ccEmail;
		}
		if (bccEmail.length !== 0) {
			formData.bcc = bccEmail;
		}

		if (attachmentPropertyString && item.binary) {

			const attachments = [];
			const attachmentProperties: string[] = attachmentPropertyString.split(',').map((propertyName) => {
				return propertyName.trim();
			});

			for (const propertyName of attachmentProperties) {
				if (!item.binary.hasOwnProperty(propertyName)) {
					continue;
				}
				attachments.push({
					value: Buffer.from(item.binary[propertyName].data, BINARY_ENCODING),
					options: {
						filename: item.binary[propertyName].fileName || 'unknown',

					}
				});
			}

			if (attachments.length) {
				// @ts-ignore
				formData.attachment = attachments;
			}
		}

		const options = {
			method: 'POST',
			formData,
			uri: `https://${credentials.apiDomain}/v3/${credentials.emailDomain}/messages`,
			auth: {
				user: 'api',
				pass: credentials.apiKey as string,
			},
			json: true,
		};

		const responseData = await this.helpers.request(options);

		return {
			json: responseData,
		};
	}
}
