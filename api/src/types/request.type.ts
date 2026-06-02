import { Request } from "express";
import { Profile } from "passport-google-oauth20";

import { UserRole } from "@repo/database";

export type RequestUser = {
	id: string;
	role: UserRole;
	iat: number;
	exp: number;
};

export interface AuthenticatedRequest extends Request {
	user: RequestUser;
}

export interface GoogleRequest extends Request {
	user: Profile;
}
