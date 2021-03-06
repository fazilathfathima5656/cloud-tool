import { OptionsWithUri } from 'request';
import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
} from '@toolbox/toolbox-core';
import {
	IDataObject
} from '@toolbox/toolbox-workflow';

export async function zohoApiRequest(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: string, resource: string, body: any = {}, qs: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any
	const options: OptionsWithUri = {
		headers: {
			'Content-Type': 'application/json',
		},
		method,
		body: {
			data: [
				body,
			],
		},
		qs,
		uri: uri || `https://www.zohoapis.com/crm/v2${resource}`,
		json: true
	};
	try {
		//@ts-ignore
		return await this.helpers.requestOAuth2.call(this, 'zohoOAuth2Api', options);
	} catch (error) {
		if (error.response && error.response.body && error.response.body.message) {
			// Try to return the error prettier
			throw new Error(`Zoho error response [${error.statusCode}]: ${error.response.body.message}`);
		}
		throw error;
	}
}

export async function zohoApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string ,method: string, endpoint: string, body: any = {}, query: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

	const returnData: IDataObject[] = [];

	let responseData;
	let uri: string | undefined;
	query.per_page = 200;
	query.page = 0;

	do {
		responseData = await zohoApiRequest.call(this, method, endpoint, body, query, uri);
		uri = responseData.info.more_records;
		returnData.push.apply(returnData, responseData[propertyName]);
		query.page++;
	} while (
		responseData.info.more_records !== undefined &&
		responseData.info.more_records === true
	);

	return returnData;
}
