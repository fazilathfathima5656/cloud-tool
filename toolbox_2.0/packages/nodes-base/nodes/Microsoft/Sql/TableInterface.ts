import { IDataObject } from '@toolbox/toolbox-workflow';

export interface ITables {
	[key: string]: {
		[key: string]: IDataObject[];
	};
}
