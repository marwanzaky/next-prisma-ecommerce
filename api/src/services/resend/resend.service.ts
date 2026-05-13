import { Injectable } from "@nestjs/common";

import { Resend } from "resend";

import { render } from "@react-email/render";

import Email from "./emails";

@Injectable()
export class ResendService {
	private resend = new Resend(process.env.RESEND_API_KEY);

	async sendEmailVerification(to: string, verifyUrl: string) {
		const { data, error } = await this.resend.emails.send({
			from: process.env.RESEND_FROM!,
			to: [to],
			subject: "Verify your email",
			html: await render(
				Email({
					title: "Thanks for signing up.",
					description: "Verify your email by clicking this link.",
					buttonText: "Verify",
					companyName: "Mamolio",
					url: verifyUrl,
				}),
			),
		});

		if (error) {
			throw error;
		}

		return data;
	}

	async sendEmailResetPassword(to: string, resetUrl: string) {
		const { data, error } = await this.resend.emails.send({
			from: process.env.RESEND_FROM!,
			to: [to],
			subject: "Reset your password",
			html: await render(
				Email({
					title: "Forgot your password?",
					description:
						"Reset your password by clicking this link. If you didn't forgot your password, please ignore this email.",
					buttonText: "Reset it now",
					companyName: "Mamolio",
					url: resetUrl,
				}),
			),
		});

		if (error) {
			throw error;
		}

		return data;
	}
}
