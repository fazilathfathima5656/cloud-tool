import {
	OptionsWithUri,
} from 'request';

import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
} from '@toolbox/toolbox-core';

import {
	IDataObject,
	IOAuth2Options,
} from '@toolbox/toolbox-workflow';

export async function boxApiRequest(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions | IHookFunctions, method: string, resource: string, body: any = {}, qs: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

	let options: OptionsWithUri = {
		headers: {
			'Content-Type': 'application/json',
		},
		method,
		body,
		qs,
		uri: uri || `https://api.box.com/2.0${resource}`,
		json: true,
	};
	options = Object.assign({}, options, option);

	try {
		if (Object.keys(body).length === 0) {
			delete options.body;
		}

		const oAuth2Options: IOAuth2Options = {
			includeCredentialsOnRefreshOnBody: true,
		};

		//@ts-ignore
		return await this.helpers.requestOAuth2.call(this, 'boxOAuth2Api', options, oAuth2Options);

	} catch (error) {

		let errorMessage;

		if (error.response && error.response.body) {

			if (error.response.body.context_info && error.response.body.context_info.errors) {
				const errors = error.response.body.context_info.errors;
				errorMessage = errors.map((e: IDataObject) => e.message);
				errorMessage = errorMessage.join('|');
			} else if (error.response.body.message) {
				errorMessage = error.response.body.message;
			}

			throw new Error(`Box error response [${error.statusCode}]: ${errorMessage}`);
		}
		throw error;
	}
}

export async function boxApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions, propertyName: string, method: string, endpoint: string, body: any = {}, query: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

	const returnData: IDataObject[] = [];

	let responseData;
	query.limit = 100;
	query.offset = 0;
	do {
		responseData = await boxApiRequest.call(this, method, endpoint, body, query);
		query.offset = responseData['offset'] + query.limit;
		returnData.push.apply(returnData, responseData[propertyName]);
	} while (
		responseData[propertyName].length !== 0
	);

	return returnData;
}
