import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { isEmail } from "class-validator";
import { Document } from "mongoose";
import { hash } from "bcrypt";
import { UserRole, User as UserType } from "@shared/user.type";

@Schema({
	timestamps: true,
})
export class User
	extends Document
	implements Omit<UserType, "_id" | "updatedAt" | "createdAt">
{
	@Prop({ required: true, enum: ["user", "admin"], default: "user" })
	role!: UserRole;

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
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await hash(this.password, 12);

	next();
});
