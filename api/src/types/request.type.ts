import { Request } from "express";
import { Profile } from "passport-google-oauth20";

import { UserRole } from "@repo/database";

export type AuthenticatedUser = {
	id: string;
	role: UserRole;
	iat: number;
	exp: number;
};

export interface AuthenticatedRequest extends Request {
	user: AuthenticatedUser;
	rawBody: Buffer<ArrayBufferLike>;
}

export interface GoogleRequest extends Request {
	user: Profile;
}
