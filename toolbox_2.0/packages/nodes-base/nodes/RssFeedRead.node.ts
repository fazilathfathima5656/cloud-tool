import { IExecuteFunctions } from '@toolbox/toolbox-core';
import {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
} from '@toolbox/toolbox-workflow';

import * as Parser from 'rss-parser';

export class RssFeedRead implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'RSS Read',
		name: 'rssFeedRead',
		icon: 'fa:rss',
		group: ['input'],
		version: 1,
		description: 'Reads data from an RSS Feed',
		defaults: {
			name: 'RSS Feed Read',
			color: '#b02020',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				required: true,
				description: 'URL of the RSS feed.',
			},
		],
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const url = this.getNodeParameter('url', 0) as string;

		if (!url) {
			throw new Error('The parameter "URL" has to be set!');
		}
		// TODO: Later add also check if the url has a valid format

		const parser = new Parser();

		let feed: Parser.Output;
		try {
			feed = await parser.parseURL(url);
		} catch (e) {
			if (e.code === 'ECONNREFUSED') {
				throw new Error(`It was not possible to connect to the URL. Please make sure the URL "${url}" it is valid!`);
			}

			throw e;
		}


		const returnData: IDataObject[] = [];

		// For now we just take the items and ignore everything else
		if (feed.items) {
			feed.items.forEach((item) => {
				// @ts-ignore
				returnData.push(item);
			});
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
