import {
	IExecuteFunctions,
	IHookFunctions,
} from '@toolbox/toolbox-core';

import {
	ICredentialDataDecryptedObject,
	IDataObject,
} from '@toolbox/toolbox-workflow';

/**
 * Make an API request to MSG91
 *
 * @param {IHookFunctions | IExecuteFunctions} this
 * @param {string} method
 * @param {string} endpoint
 * @param {object} form
 * @param {object | undefined} qs
 * @returns {Promise<any>}
 */
export async function sms77ApiRequest(this: IHookFunctions | IExecuteFunctions, method: string, endpoint: string, form: IDataObject, qs?: IDataObject): Promise<any> { // tslint:disable-line:no-any
	const credentials = this.getCredentials('sms77Api');
	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}

	if ('GET' === method) {
		qs = setPayload(credentials, qs);
	} else {
		form = setPayload(credentials, form);
	}
	const response = await this.helpers.request({
		form,
		json: true,
		method,
		qs,
		uri: `https://gateway.sms77.io/api/${endpoint}`,
	});

	if ('100' !== response.success) {
		throw new Error('Invalid sms77 credentials or API error!');
	}

	return response;
}


function setPayload(credentials: ICredentialDataDecryptedObject, o?: IDataObject) {
	if (!o) {
		o = {};
	}

	o.p = credentials!.apiKey as string;
	o.json = 1;
	o.sendwith = 'toolbox';

	return o;
}
