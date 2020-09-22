import {
	OptionsWithUri,
} from 'request';

import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
} from '@toolbox/toolbox-core';

import {
	IDataObject,
} from '@toolbox/toolbox-workflow';

export async function philipsHueApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: string, resource: string, body: any = {}, qs: IDataObject = {}, uri?: string, headers: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any
	const options: OptionsWithUri = {
		headers: {
			'Content-Type': 'application/json',
		},
		method,
		body,
		qs,
		uri: uri || `https://api.meethue.com${resource}`,
		json: true
	};
	try {
		if (Object.keys(headers).length !== 0) {
			options.headers = Object.assign({}, options.headers, headers);
		}

		if (Object.keys(body).length === 0) {
			delete options.body;
		}

		if (Object.keys(qs).length === 0) {
			delete options.qs;
		}

		//@ts-ignore
		return await this.helpers.requestOAuth2.call(this, 'philipsHueOAuth2Api', options, { tokenType: 'Bearer' });
	} catch (error) {
		if (error.response && error.response.body && error.response.body.error) {

			const errorMessage = error.response.body.error.description;

			// Try to return the error prettier
			throw new Error(
				`Philip Hue error response [${error.statusCode}]: ${errorMessage}`
			);
		}
		throw error;
	}
}

export async function getUser(this: IExecuteFunctions | ILoadOptionsFunctions): Promise<any> { // tslint:disable-line:no-any
	const { whitelist } = await philipsHueApiRequest.call(this, 'GET', '/bridge/0/config', {}, {});
	//check if there is a toolbox user
	for (const user of Object.keys(whitelist)) {
		if (whitelist[user].name === 'toolbox') {
			return user;
		}
	}
	// toolbox user was not fount then create the user
	await philipsHueApiRequest.call(this, 'PUT', '/bridge/0/config', { linkbutton: true });
	const { success } = await philipsHueApiRequest.call(this, 'POST', '/bridge', { devicetype: 'toolbox' });
	return success.username;
}
