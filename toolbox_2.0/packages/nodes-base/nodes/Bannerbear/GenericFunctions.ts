import {
	OptionsWithUri,
 } from 'request';

import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
} from '@toolbox/toolbox-core';

import {
	IDataObject,
	IHookFunctions,
	IWebhookFunctions,
} from '@toolbox/toolbox-workflow';

import {
	snakeCase,
} from 'change-case';

export async function bannerbearApiRequest(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, method: string, resource: string, body: any = {}, query: IDataObject = {}, uri?: string, headers: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

	const credentials = this.getCredentials('bannerbearApi');

	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}

	const options: OptionsWithUri = {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${credentials.apiKey}`,
		},
		method,
		body,
		qs: query,
		uri: uri || `https://api.bannerbear.com/v2${resource}`,
		json: true,
	};
	if (!Object.keys(body).length) {
		delete options.form;
	}
	if (!Object.keys(query).length) {
		delete options.qs;
	}
	options.headers = Object.assign({}, options.headers, headers);
	try {
		return await this.helpers.request!(options);
	} catch (error) {
		if (error.response && error.response.body && error.response.body.message) {
			// Try to return the error prettier
				//@ts-ignore
				throw new Error(`Bannerbear error response [${error.statusCode}]: ${error.response.body.message}`);
		}
		throw error;
	}
}

export function keysToSnakeCase(elements: IDataObject[] | IDataObject) : IDataObject[] {
	if (!Array.isArray(elements)) {
		elements = [elements];
	}
	for (const element of elements) {
		for (const key of Object.keys(element)) {
			if (key !== snakeCase(key)) {
				element[snakeCase(key)] = element[key];
				delete element[key];
			}
		}
	}
	return elements;
}