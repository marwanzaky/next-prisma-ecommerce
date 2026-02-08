export interface IContactMessage {
	_id: string;
	name: string;
	email: string;
	subject: string;
	message: string;
	status: "new" | "read" | "replied";
}

export type ICreateContactMessage = Omit<IContactMessage, "_id" | "status">;
