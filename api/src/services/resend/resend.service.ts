import { Injectable } from "@nestjs/common";

import { Resend } from "resend";

import { render } from "@react-email/render";

import Email from "@/emails/email";
import OrderConfirmationEmail, {
	OrderConfirmationProps,
} from "@/emails/orders";

@Injectable()
export class ResendService {
	private resend = new Resend(process.env.RESEND_API_KEY);

	private from: string;

	constructor() {
		this.from = process.env.RESEND_FROM!;
	}

	async sendEmailVerification(to: string, verifyUrl: string) {
		const { data, error } = await this.resend.emails.send({
			from: this.from,
			to: [to],
			subject: "Verify your email",
			html: await render(
				Email({
					title: "Thanks for signing up.",
					description: "Verify your email by clicking this link.",
					buttonText: "Verify",
					companyName: "Mamolio",
					url: verifyUrl,
					preview: "Thanks for signing up",
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
			from: this.from,
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
					preview: "Reset your password",
				}),
			),
		});

		if (error) {
			throw error;
		}

		return data;
	}

	async sendOrderConfirmation(to: string, payload: OrderConfirmationProps) {
		const { data, error } = await this.resend.emails.send({
			from: this.from,
			to: [to],
			subject: `Order Confirmation - #${payload.orderNumber}`,
			html: await render(OrderConfirmationEmail(payload)),
		});

		if (error) {
			throw error;
		}

		return data;
	}
}
