import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { hash } from "bcryptjs";
import { isEmail } from "class-validator";
import { Document } from "mongoose";

import { User as UserType, UserRole, WithoutMongoMeta } from "@repo/types";

@Schema({
	timestamps: true,
})
export class User extends Document implements WithoutMongoMeta<UserType> {
	@Prop({ required: true, enum: ["user", "admin"], default: "user" })
	role!: UserRole;

	@Prop({ type: Boolean, default: false })
	isVerified!: boolean;

	@Prop({ type: String, select: false })
	emailVerificationTokenHash?: string;

	@Prop({ type: Date, select: false })
	emailVerificationTokenExpiresAt?: Date;

	@Prop({
		type: String,
		default: "",
	})
	photoUrl?: string;

	@Prop({ required: true })
	name!: string;

	@Prop({
		unique: true,
		required: true,
		lowercase: true,
		index: true,
		validate: {
			validator: (value: string) => isEmail(value),
			message: "Please enter a valid email",
		},
	})
	email!: string;

	@Prop({ required: true, minlength: 8, select: false })
	password!: string;

	@Prop({ type: Date })
	passwordChangedAt!: Date;

	changedPasswordAfter!: (jwtTimestamp: number) => boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>("save", async function () {
	if (!this.isModified("password")) {
		return;
	}

	this.password = await hash(this.password, 12);
});

UserSchema.pre<User>("save", function () {
	if (!this.isModified("password") || this.isNew) return;

	this.passwordChangedAt = new Date(Date.now() - 1000);
});

UserSchema.methods.changedPasswordAfter = function (
	this: User,
	jwtTimestamp: number,
) {
	if (this.passwordChangedAt) {
		const changedTimestamp = Math.floor(
			this.passwordChangedAt.getTime() / 1000,
		);
		return jwtTimestamp < changedTimestamp;
	}

	return false;
};
