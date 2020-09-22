import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions
} from '@toolbox/toolbox-core';
import { IDataObject } from '@toolbox/toolbox-workflow';
import { ICollection } from './CollectionInterface';
import { cockpitApiRequest } from './GenericFunctions';

export async function createCollectionEntry(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, resourceName: string, data: IDataObject, id?: string): Promise<any> { // tslint:disable-line:no-any
	const body: ICollection = {
		data,
	};

	if (id) {
		body.data = {
			_id: id,
			...body.data
		};
	}

	return cockpitApiRequest.call(this, 'post', `/collections/save/${resourceName}`, body);
}


export async function getAllCollectionEntries(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, resourceName: string, options: IDataObject): Promise<any> { // tslint:disable-line:no-any
	const body: ICollection = {};

	if (options.fields) {
		const fields = (options.fields as string).split(',').map(field => field.trim() );

		const bodyFields = {
			_id: false,
		} as IDataObject;
		for (const field of fields) {
			bodyFields[field] = true;
		}

		body.fields = bodyFields;
	}

	if (options.filter) {
		body.filter = JSON.parse(options.filter.toString());
	}

	if (options.limit) {
		body.limit = options.limit as number;
	}

	if (options.skip) {
		body.skip = options.skip as number;
	}

	if (options.sort) {
		body.sort = JSON.parse(options.sort.toString());
	}

	if (options.populate) {
		body.populate = options.populate as boolean;
	}

	body.simple = true;
	if (options.rawData) {
		body.simple = !options.rawData as boolean;
	}

	if (options.language) {
		body.lang = options.language as string;
	}

	return cockpitApiRequest.call(this, 'post', `/collections/get/${resourceName}`, body);
}


export async function getAllCollectionNames(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions): Promise<string[]> {
	return cockpitApiRequest.call(this, 'GET', `/collections/listCollections`, {});
}
