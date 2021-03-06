import { OptionsWithUri } from 'request';
import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
} from '@toolbox/toolbox-core';
import { IDataObject, IHookFunctions } from '@toolbox/toolbox-workflow';

export async function mailjetApiRequest(this: IExecuteFunctions | IExecuteSingleFunctions | IHookFunctions | ILoadOptionsFunctions, method: string, resource: string, body: any = {}, qs: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any
	const emailApiCredentials = this.getCredentials('mailjetEmailApi');
	let options: OptionsWithUri = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method,
		qs,
		body,
		uri: uri ||`https://api.mailjet.com${resource}`,
		json: true
	};
	options = Object.assign({}, options, option);
	if (Object.keys(options.body).length === 0) {
		delete options.body;
	}
	if (emailApiCredentials !== undefined) {
		const base64Credentials = Buffer.from(`${emailApiCredentials.apiKey}:${emailApiCredentials.secretKey}`).toString('base64');
		//@ts-ignore
		options.headers['Authorization'] = `Basic ${base64Credentials}`;
	} else {
		const smsApiCredentials = this.getCredentials('mailjetSmsApi');
		//@ts-ignore
		options.headers['Authorization'] = `Bearer ${smsApiCredentials.token}`;
	}
	try {
		return await this.helpers.request!(options);
	} catch (error) {
		if (error.response.body || error.response.body.ErrorMessage) {
			throw new Error(`Mailjet Error: response [${error.statusCode}]: ${error.response.body.ErrorMessage}`);
		}
		throw new Error(error);
	}
}

export async function mailjetApiRequestAllItems(this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions, method: string, endpoint: string, body: any = {}, query: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

	const returnData: IDataObject[] = [];

	let responseData;

	query.Limit = 1000;
	query.Offset = 0;

	do {
		responseData = await mailjetApiRequest.call(this, method, endpoint, body, query, undefined, { resolveWithFullResponse: true });
		returnData.push.apply(returnData, responseData.body);
		query.Offset = query.Offset + query.Limit;
	} while (
		responseData.length !== 0
	);
	return returnData;
}
