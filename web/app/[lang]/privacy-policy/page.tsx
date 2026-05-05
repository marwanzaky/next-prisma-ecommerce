import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";

import config from "@/lib/config";

export default function Page() {
	return (
		<Container>
			<Section className="prose prose-slate max-w-lg mx-auto">
				<h1>Privacy Policy</h1>
				<h2>Privacy Policy</h2>
				<p>
					This Privacy Policy describes how {config.websiteName} (the “Site” or
					“we”) collects, uses, and discloses your Personal Information when you
					visit or make a purchase from the Site.
				</p>

				<h2>Collecting Personal Information</h2>
				<p>
					When you visit the Site, we collect certain information about your
					device, your interaction with the Site, and information necessary to
					process your purchases. We may also collect additional information if
					you contact us for customer support. In this Privacy Policy, we refer
					to any information that can uniquely identify an individual (including
					the information below) as “Personal Information”. See the list below
					for more information about what Personal Information we collect and
					why.
				</p>
			</Section>
		</Container>
	);
}
