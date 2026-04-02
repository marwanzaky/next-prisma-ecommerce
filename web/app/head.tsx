import { website } from "@lib/config";
import { Organization, WebSite, WithContext, WebPage } from "schema-dts";

export default function Head() {
	const homepageSchema = generateHomepageSchema();

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(homepageSchema),
			}}
		/>
	);
}

export function generateHomepageSchema() {
	const webpage: WithContext<WebPage> = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: website.name,
		description: website.description,
		url: website.baseUrl,
		image: website.openGraphImage,
	};

	return {
		"@context": "https://schema.org",
		"@graph": [
			generateOrganizationSchema(),
			generateEcommerceSchema(),
			webpage,
		],
	};
}

export function generateOrganizationSchema(): WithContext<Organization> {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: website.name,
		url: website.baseUrl,
		logo: website.logo,
		description: website.description,
		email: website.email,
		telephone: website.phone,
		sameAs: [
			website.social.twitter,
			website.social.instagram,
			website.social.youtube,
		].filter(Boolean),
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "Customer Service",
			email: website.email,
			telephone: website.phone,
		},
	};
}

export function generateEcommerceSchema(): WithContext<WebSite> {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: website.name,
		url: website.baseUrl,
		description: website.description,
		image: website.openGraphImage,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${website.baseUrl}/products?search={search_term_string}`,
			},
			query: "required name=search_term_string",
		},
		publisher: generateOrganizationSchema(),
	};
}
