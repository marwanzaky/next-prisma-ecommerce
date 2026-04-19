"use client";

import { useAppSelector } from "@/redux/store";

import { Section } from "@/shared/components/ui/section";
import { Heading } from "@/shadcn/components/ui/typography";

import PersonalInformationCard from "./components/personal-information-card";
import ChangePasswordCard from "./components/change-password-card";
import DeleteAccountCard from "./components/delete-account-card";

export default function Page() {
	const { user } = useAppSelector((state) => state.authReducer);

	return (
		<Section className="m-auto max-w-sm space-y-2 lg:space-y-4">
			<Heading as="h4" className="text-center">
				Settings
			</Heading>

			<div className="flex flex-col gap-4">
				<PersonalInformationCard />
				<ChangePasswordCard />
				{user && user.role === "admin" && <DeleteAccountCard />}
			</div>
		</Section>
	);
}
