export type IContactMessageStatus = "new" | "read" | "replied";

export interface IContactMessage {
	_id: string;
	name: string;
	email: string;
	subject: string;
	message: string;
	status: IContactMessageStatus;
}

export type ICreateContactMessage = Omit<IContactMessage, "_id" | "status">;
