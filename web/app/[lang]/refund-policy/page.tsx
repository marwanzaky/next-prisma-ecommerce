import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";

export default function Page() {
	return (
		<Container>
			<Section className="prose prose-slate max-w-lg mx-auto">
				<h1>Refund Policy</h1>
				<h2>Refund Policy</h2>
				<p>
					We have a 30-day return policy, which means you have 30 days after
					receiving your item to request a return.
					<br />
					<br />
					To be eligible for a return, your item must be in the same condition
					that you received it, unworn or unused, with tags, and in its original
					packaging. You&#39;ll also need the receipt or proof of purchase.
					<br />
					<br />
					To start a return, you can contact us at{" "}
					{process.env.NEXT_PUBLIC_CONTACT}. If your return is accepted,
					we&#39;ll send you a return shipping label, as well as instructions on
					how and where to send your package. Items sent back to us without
					first requesting a return will not be accepted.
					<br />
					<br />
					You can always contact us for any return question at{" "}
					{process.env.NEXT_PUBLIC_CONTACT}.
				</p>

				<h2>Damages and issues</h2>
				<p>
					Please inspect your order upon reception and contact us immediately if
					the item is defective, damaged or if you receive the wrong item, so
					that we can evaluate the issue and make it right.
				</p>

				<h2>Exceptions / non-returnable items</h2>
				<p>
					Certain types of items cannot be returned, like perishable goods (such
					as food, flowers, or plants), custom products (such as special orders
					or personalized items), and personal care goods (such as beauty
					products). We also do not accept returns for hazardous materials,
					flammable liquids, or gases. Please get in touch if you have questions
					or concerns about your specific item.
					<br />
					<br />
					Unfortunately, we cannot accept returns on sale items or gift cards.
				</p>

				<h2>Refunds</h2>
				<p>
					We will notify you once we&#39;ve received and inspected your return,
					and let you know if the refund was approved or not. If approved,
					you&#39;ll be automatically refunded on your original payment method.
					Please remember it can take some time for your bank or credit card
					company to process and post the refund too.
				</p>
			</Section>
		</Container>
	);
}
