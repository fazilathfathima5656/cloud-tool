import { IDataObject } from '@toolbox/toolbox-workflow';

export interface IConversation {
	assignTo?: number;
	autoReply?: boolean;
	closedAt?: string;
	createdAt?: string;
	customer?: IDataObject;
	fields?: IDataObject[];
	imported?: boolean;
	mailboxId?: number;
	status?: string;
	subject?: string;
	tags?: IDataObject[];
	threads?: IDataObject[];
	type?: string;
	user?: number;
}
