"use client";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { toast } from "sonner";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { contactMessagesService } from "@/services/contact-messages-service";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";

import { Button } from "@/shadcn/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/components/ui/field";
import { Input } from "@/shadcn/components/ui/input";
import { Spinner } from "@/shadcn/components/ui/spinner";
import { Textarea } from "@/shadcn/components/ui/textarea";
import { Heading } from "@/shadcn/components/ui/typography";
import { TypographyP } from "@/shadcn/components/ui/typography";

import { localizePath } from "@/lib/i18n";

type ContactInput = {
	name: string;
	email: string;
	subject: string;
	message: string;
};

export default function Page() {
	const router = useRouter();
	const { locale, t } = useI18n();
	const contactSchema = z.object({
		name: z
			.string()
			.nonempty(t("validation.required"))
			.min(2, t("validation.nameShort"))
			.max(16, t("validation.nameLong")),
		email: z
			.email(t("validation.emailInvalid"))
			.nonempty(t("validation.required"))
			.max(32, t("validation.emailTooLong")),
		subject: z
			.string()
			.nonempty(t("validation.required"))
			.min(4, t("contactPage.subjectShort"))
			.max(64, t("contactPage.subjectLong")),
		message: z.string().nonempty(t("validation.required")),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ContactInput>({
		resolver: zodResolver(contactSchema),
		mode: "onSubmit",
		defaultValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
	});

	const onSubmit = async (data: ContactInput) => {
		try {
			await contactMessagesService.sendMessage(data);

			toast(t("contactPage.success"), {
				position: "top-center",
			});

			router.push(localizePath("/", locale));
		} catch (error) {
			toast(t("contactPage.error"), { position: "top-center" });

			console.error(error);
		}
	};

	return (
		<Container>
			<Section className="grid grid-cols-1 md:grid-cols-2 gap-12">
				<div>
					<Heading as="h1" variant="h2" className="text-center border-none">
						{t("contactPage.title")}
					</Heading>
					<Heading as="h2" variant="h4">
						{t("contactPage.subtitle")}
					</Heading>
					<TypographyP>
						{t("contactPage.description")}
						<br /> <br />
						{t("contactPage.descriptionFollowup")}
					</TypographyP>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<FieldGroup>
						<Field data-invalid={!!errors.name}>
							<FieldLabel htmlFor="name">{t("contactPage.name")}</FieldLabel>
							<FieldContent>
								<Input
									id="name"
									placeholder="John Doe"
									aria-invalid={!!errors.name}
									{...register("name")}
								/>
							</FieldContent>
							<FieldError>{errors.name?.message}</FieldError>
						</Field>
						<Field data-invalid={!!errors.email}>
							<FieldLabel htmlFor="email">{t("form.email")}</FieldLabel>
							<FieldContent>
								<Input
									id="email"
									placeholder="m@example.com"
									aria-invalid={!!errors.email}
									{...register("email")}
								/>
							</FieldContent>
							<FieldError>{errors.email?.message}</FieldError>
						</Field>
						<Field data-invalid={!!errors.subject}>
							<FieldLabel htmlFor="subject">
								{t("contactPage.subject")}
							</FieldLabel>
							<Input
								id="subject"
								aria-invalid={!!errors.subject}
								{...register("subject")}
							/>
							<FieldError>{errors.subject?.message}</FieldError>
						</Field>
						<Field data-invalid={!!errors.message}>
							<FieldLabel htmlFor="message">
								{t("contactPage.message")}
							</FieldLabel>
							<Textarea
								id="message"
								className="h-32"
								aria-invalid={!!errors.message}
								{...register("message")}
							/>
							<FieldError>{errors.message?.message}</FieldError>
						</Field>

						<Field>
							<Button size="lg" type="submit" disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<Spinner /> {t("contactPage.sending")}
									</>
								) : (
									t("contactPage.send")
								)}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</Section>
		</Container>
	);
}
