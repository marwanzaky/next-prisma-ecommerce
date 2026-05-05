import { Injectable } from "@nestjs/common";

import { Resend } from "resend";

@Injectable()
export class ResendService {
	resend = new Resend(process.env.RESEND_API_KEY);

	async sendEmailVerification(to: string, verifyUrl: string) {
		const { data, error } = await this.resend.emails.send({
			from: process.env.RESEND_FROM!,
			to: [to],
			subject: "Verify your email",
			html: `
				<p>Thanks for signing up.</p>
				<p>Verify your email by clicking this link:</p>
				<p><a href="${verifyUrl}">${verifyUrl}</a></p>
			`,
		});

		if (error) {
			throw error;
		}

		return data;
	}
}
