import { UserRole } from "@shared/user.type";
import { Request } from "express";

export interface IRequest extends Request {
	user: {
		id: string;
		role: UserRole;
		iat: number;
		exp: number;
	};
}
