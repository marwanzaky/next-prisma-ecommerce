import { EntityBase } from "./entity.type.js";
import { WithoutMongoMeta } from "./mongoose.type.js";

export type ContactMessageStatus = "new" | "read" | "replied";

export type ContactMessage = EntityBase & {
	name: string;
	email: string;
	subject: string;
	message: string;
	status: ContactMessageStatus;
};

export type CreateContactMessage = Omit<
	WithoutMongoMeta<ContactMessage>,
	"status"
>;
