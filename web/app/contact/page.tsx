"use client";

import { useRouter } from "next/navigation";

import { contactMessagesService } from "@redux/services/contact-messages-service";
import { Section } from "@shared/components/ui/section";
import { useForm } from "react-hook-form";
import { Heading } from "@shadcn/components/ui/typography";
import { TypographyP } from "@shadcn/components/ui/typography";
import { Button } from "@shadcn/components/ui/button";
import { toast } from "sonner";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@shadcn/components/ui/field";
import { Input } from "@shadcn/components/ui/input";
import { Textarea } from "@shadcn/components/ui/textarea";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@shadcn/components/ui/spinner";

const ContactSchema = z.object({
	name: z
		.string()
		.nonempty("This field is required.")
		.min(2, "Name is too short.")
		.max(16, "Name is too long."),
	email: z
		.email()
		.nonempty("This field is required.")
		.max(32, "Email is too short."),
	subject: z
		.string()
		.nonempty("This field is required.")
		.min(4, "Subject is too short.")
		.max(64, "Subject is too long."),
	message: z.string().nonempty("This field is required."),
});

type ContactInput = z.infer<typeof ContactSchema>;

export default function Page() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ContactInput>({
		resolver: zodResolver(ContactSchema),
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

			toast("Message sent successfully. Thank you!", {
				position: "top-center",
			});

			router.push("/");
		} catch (error) {
			toast("Something went wrong.", { position: "top-center" });

			console.error(error);
		}
	};

	return (
		<Section className="grid grid-cols-1 md:grid-cols-2 gap-12">
			<div>
				<Heading as="h1" variant="h2" className="text-center border-none">
					Contact Us
				</Heading>
				<Heading as="h2" variant="h4">
					Have a question?
				</Heading>
				<TypographyP>
					Email us and we&apos;ll get back to you within 24 hours.
					Monday-Saturday <br /> <br />
					Please fill the form below to contact us and we will get back to you
					as soon as possible! We&apos;re happy to answer questions or help.
				</TypographyP>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<FieldGroup>
					<Field data-invalid={!!errors.name}>
						<FieldLabel htmlFor="name">Name</FieldLabel>
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
						<FieldLabel htmlFor="email">Email</FieldLabel>
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
						<FieldLabel htmlFor="subject">Subject</FieldLabel>
						<Input
							id="subject"
							aria-invalid={!!errors.subject}
							{...register("subject")}
						/>
						<FieldError>{errors.subject?.message}</FieldError>
					</Field>
					<Field data-invalid={!!errors.message}>
						<FieldLabel htmlFor="message">Message</FieldLabel>
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
									<Spinner /> Sending...
								</>
							) : (
								"Send"
							)}
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</Section>
	);
}
