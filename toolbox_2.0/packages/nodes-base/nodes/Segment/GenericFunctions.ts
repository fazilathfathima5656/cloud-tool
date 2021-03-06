import { OptionsWithUri } from 'request';
import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
} from '@toolbox/toolbox-core';
import { IDataObject } from '@toolbox/toolbox-workflow';

export async function segmentApiRequest(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: string, resource: string, body: any = {}, qs: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any
	const credentials = this.getCredentials('segmentApi');
	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}
	const base64Key =  Buffer.from(`${credentials.writekey}:`).toString('base64');
	const options: OptionsWithUri = {
		headers: {
			Authorization: `Basic ${base64Key}`,
			'Content-Type': 'application/json',
		},
		method,
		qs,
		body,
		uri: uri ||`https://api.segment.io/v1${resource}`,
		json: true
	};
	if (!Object.keys(body).length) {
		delete options.body;
	}
	try {
		return await this.helpers.request!(options);
	} catch (error) {
		throw new Error('Segment Error: ' + error);
	}
}
