import { Request } from "express";

import { UserRole } from "@repo/types";

export type RequestUser = {
	id: string;
	role: UserRole;
	iat: number;
	exp: number;
};

export interface IRequest extends Request {
	user: RequestUser;
}
