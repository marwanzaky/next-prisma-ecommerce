"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Feedback from "@components/feedback";

import Stars from "_shared/components/stars";

import Link from "next/link";

import { IProduct } from "_shared/interfaces";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { postCartItemAsync } from "@redux/thunks/cartThunks";
import { InputText } from "_shared/components/inputText";
import { useToggleFavorite } from "@hooks/useToggleFavorite";
import { useQuery } from "@tanstack/react-query";
import {
	GetAllProductsOptions,
	productsService,
} from "@redux/services/productsService";
import ProductCart from "_shared/ui/productCart";
import { cn } from "@lib/utils";
import { ButtonIcon } from "_shared/ui/buttonIcon";
import { Button } from "_shared/shadcn/button";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "_shared/shadcn/breadcrumb";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "_shared/shadcn/accordion";
import { Section } from "_shared/components/section";
import { useToast } from "_shared/shadcn/hooks/use-toast";
import { TypographyH4, TypographyP } from "_shared/ui/typography";
import { TypographyH3 as ShadcnTypographyH3 } from "_shared/shadcn/typography";
import { formatPrice } from "@utils/formatPrice";
import { categoriesService } from "@redux/services/categoriesService";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "_shared/shadcn/tooltip";
import { PublicCategoryTree } from "@shared/category.type";

function Preview({ product }: { product: IProduct }) {
	const { isFavorite, addToFavorites, removeFromFavorites } =
		useToggleFavorite(product);

	const [imgIndex, setImgIndex] = useState(0);

	const next = () => {
		setImgIndex((prev) => (prev + 1) % product.imgUrls.length);
	};

	const prev = () => {
		setImgIndex((prev) => (prev === 0 ? product.imgUrls.length - 1 : prev - 1));
	};

	return (
		<div className="group/container relative md:sticky md:top-20 md:h-fit">
			<div className="opacity-0 group-hover/container:opacity-100 z-10 absolute top-1 right-1 transition-all">
				{isFavorite ? (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-all"
						styleClass="filter-custom-primary-foreground"
						icon="favorite_fill"
						onClick={removeFromFavorites}
					/>
				) : (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-all"
						icon="favorite"
						onClick={addToFavorites}
					/>
				)}
			</div>

			<div className="relative">
				<Image
					className="w-full mb-2 md:mb-4 rounded-md shadow-md"
					src={product.imgUrls[imgIndex]}
					alt={product.name}
					width={512}
					height={512}
				/>

				<ButtonIcon
					className="absolute shadow-md top-[calc(50%-19px)] right-[9.5px]"
					icon="arrow_forward"
					onClick={next}
				/>

				<ButtonIcon
					className="absolute shadow-md top-[calc(50%-19px)] left-[9.5px]"
					icon="arrow_back"
					onClick={prev}
				/>
			</div>

			<div className="grid grid-cols-4 gap-2 md:gap-4">
				{product.imgUrls.map((img, i) => (
					<Image
						role="button"
						className={cn(
							"w-full rounded-md opacity-100 hover:opacity-50 shadow-md border border-transparent hover:border-black",
							i === imgIndex && "border-primary",
						)}
						key={`${product.name} ${i + 1}`}
						src={img}
						alt={`${product.name} ${i + 1}`}
						onClick={() => setImgIndex(i)}
						width={128}
						height={128}
					/>
				))}
			</div>
		</div>
	);
}

function Details({ product }: { product: IProduct }) {
	const router = useRouter();
	const { toast } = useToast();

	const dispatch = useDispatch<AppDispatch>();

	const { data } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

	const [quantity, setQuantity] = useState(1);

	const [category, setCategory] = useState<PublicCategoryTree>();

	useEffect(() => {
		if (data) {
			const category = data
				.flatMap((cat) => [...cat.children, cat])
				.find((cat) => cat.id === product.category);
			setCategory(category);
		}
	}, [data]);

	return (
		<div className="space-y-4 lg:space-y-8">
			<div className="space-y-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbSeparator />

						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/products">Products</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbSeparator />

						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href={`/products?category=${category?.slug}`}>
									{category?.name}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbSeparator />

						<BreadcrumbItem className="min-w-0 flex-1">
							<Tooltip>
								<TooltipTrigger asChild>
									<BreadcrumbPage className="truncate">
										{product?.name}
									</BreadcrumbPage>
								</TooltipTrigger>
								<TooltipContent>{product?.name}</TooltipContent>
							</Tooltip>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="space-y-1 lg:space-y-2">
					<h1 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
						{product.name}
					</h1>

					<div className="flex items-center gap-2">
						<div className="text-4xl">{formatPrice(product.price)}</div>
						{product.priceCompare > product.price && (
							<div className="text-muted-foreground line-through text-2xl">
								{formatPrice(product.priceCompare)}
							</div>
						)}
					</div>

					{process.env.NEXT_PUBLIC_REVIEWS === "true" && (
						<Stars value={product.avgRatings} total={product.numReviews} />
					)}
				</div>
			</div>

			<div className="space-y-2">
				<label className="font-bold" htmlFor="quantity">
					Quantity:
				</label>

				<InputText
					className="w-28"
					id="quantity"
					type="number"
					value={quantity}
					min={1}
					max={100}
					onChange={(e) => setQuantity(parseInt(e.target.value))}
				/>
			</div>

			<div className="space-y-2 flex flex-col">
				<Button
					size="lg"
					onClick={() =>
						dispatch(postCartItemAsync({ product, toast, quantity }))
					}
				>
					Add to cart
				</Button>

				<Button
					size="lg"
					variant="secondary"
					onClick={() => {
						dispatch(postCartItemAsync({ product, toast, quantity }));
						router.push("/cart");
					}}
				>
					Buy it now
				</Button>
			</div>

			<Accordion
				defaultValue="item-1"
				type="single"
				collapsible
				className="w-full"
			>
				<AccordionItem value="item-1">
					<AccordionTrigger>Description</AccordionTrigger>
					<AccordionContent asChild>
						<div dangerouslySetInnerHTML={{ __html: product.description }} />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>Shipping and Refund Policy</AccordionTrigger>
					<AccordionContent>
						<TypographyH4>Refund Policy</TypographyH4>
						<TypographyP>
							We have a 30-day return policy, which means you have 30 days after
							receiving your item to request a return.
							<br />
							<br />
							To be eligible for a return, your item must be in the same
							condition that you received it, unworn or unused, with tags, and
							in its original packaging. You&apos;ll also need the receipt or
							proof of purchase.
							<br />
							<br />
							To start a return, you can contact us at{" "}
							{process.env.NEXT_PUBLIC_CONTACT}. If your return is accepted,
							we&apos;ll send you a return shipping label, as well as
							instructions on how and where to send your package. Items sent
							back to us without first requesting a return will not be accepted.
							<br />
							<br />
							You can always contact us for any return question at{" "}
							{process.env.NEXT_PUBLIC_CONTACT}.
							<br />
							<br />
						</TypographyP>

						<TypographyH4>Shipping policy</TypographyH4>
						<TypographyP>
							All orders are processed within 1 to 3 business days (excluding
							weekends and holidays) after receiving your order confirmation
							email. You will receive another notification when your order has
							shipped.
							<br />
							<br />
						</TypographyP>

						<TypographyH4>International Shipping</TypographyH4>
						<TypographyP>
							We offer international shipping to the following countries: United
							States, United Kingdom, Australia, Canada, Germany, France, Spain,
							United Arab Emirates, Indonesia.
							<br />
							<br />
							Your order may be subject to import duties and taxes (including
							VAT), which are incurred once a shipment reaches your destination
							country.
						</TypographyP>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}

export default function ProductDetails({ product }: { product: IProduct }) {
	const options: GetAllProductsOptions = {
		query: {
			excludeIds: [product._id],
			category: product.category,
			limit: 4,
		},
	};

	const { data: similarProducts } = useQuery({
		queryKey: ["similar-products", options],
		queryFn: () => productsService.getAllProducts(options),
		staleTime: 1000 * 60 * 5,
	});

	return (
		<>
			<Section>
				<div
					className={cn(
						"md:relative",
						"grid grid-cols-1 md:grid-cols-2",
						"gap-x-10 gap-y-5",
						process.env.NEXT_PUBLIC_REVIEWS === "true" && "mb-8",
					)}
				>
					<Preview product={product} />
					<Details product={product} />
				</div>

				{process.env.NEXT_PUBLIC_REVIEWS === "true" && (
					<Feedback product={product} />
				)}
			</Section>

			{similarProducts && similarProducts.length > 0 && (
				<Section className="!pt-0 space-y-2 lg:space-y-4">
					<ShadcnTypographyH3 className="text-center lg:text-left">
						Similar products
					</ShadcnTypographyH3>

					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
						{similarProducts.map((item) => (
							<ProductCart key={item._id} data={item} />
						))}
					</div>
				</Section>
			)}
		</>
	);
}
