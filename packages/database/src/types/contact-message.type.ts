import { ContactMessage } from "../../generated/prisma/client";

export type CreateContactMessage = Pick<
	ContactMessage,
	"name" | "email" | "subject" | "message"
>;
