import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useRouter } from "next/navigation";

import { LineBreakNode, ParagraphNode } from "lexical";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProduct, UpdateProduct } from "@repo/database";
import { useQuery } from "@tanstack/react-query";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";

import {
	createUserProductAsync,
	removeUserProductAsync,
	updateUserProductAsync,
} from "@/redux/slices/user-products-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

import { categoriesService } from "@/services/categories-service";

import { useI18n } from "@/components/layout/i18n-provider";
import { ImageNode } from "@/components/ui/lexical/nodes/image-node";
import { YouTubeNode } from "@/components/ui/lexical/nodes/youtube-node";

import { localizePath } from "@/lib/i18n";

import { getSellColumns, SellProduct } from "./columns";

function createProductSchema(t: ReturnType<typeof useI18n>["t"]) {
	const imageSlotSchema = z
		.object({
			url: z.url().optional(),
			file: z.instanceof(File).optional(),
		})
		.optional();

	return z.object({
		name: z
			.string()
			.nonempty(t("validation.required"))
			.min(2, t("validation.nameShort"))
			.max(120, t("validation.nameLong")),
		description: z.string().nonempty(t("validation.required")),
		categoryId: z.string().nonempty(t("validation.required")),
		tags: z.array(z.string()).min(1, t("validation.required")),
		options: z.array(
			z.object({
				name: z.string(),
				values: z.array(z.string()),
			}),
		),
		variants: z.array(
			z.object({
				variantId: z.string().optional(),
				title: z.string(),
				price: z.number().min(0, "Price must be positive"),
				stock: z.number().int().min(0, "Stock cannot be negative"),
				sku: z.string().optional(),
				selections: z.array(
					z.object({
						optionName: z.string(),
						optionValue: z.string(),
					}),
				),
				images: z.array(imageSlotSchema).max(10, "Max 10 images"),
			}),
		),
		images: z
			.array(imageSlotSchema)
			.max(10, "Max 10 images")
			.refine((imgs) => imgs.some((img) => Boolean(img?.url || img?.file)), {
				message: t("validation.required"),
			}),
	});
}

export type ProductInput = z.infer<ReturnType<typeof createProductSchema>>;

export function useSell() {
	const router = useRouter();

	const dispatch = useAppDispatch();

	const { locale, t } = useI18n();
	const productSchema = createProductSchema(t);

	const { products, loading } = useAppSelector((state) => state.userProducts);

	const initialConfig: InitialConfigType = {
		namespace: "MyEditor",
		nodes: [
			ImageNode,
			YouTubeNode,
			ParagraphNode,
			LineBreakNode,
			ListNode,
			ListItemNode,
			CodeNode,
			CodeHighlightNode,
			TableNode,
			TableCellNode,
			TableRowNode,
			AutoLinkNode,
			LinkNode,
		],
		onError: console.error,
	};

	const form = useForm<ProductInput>({
		resolver: zodResolver(productSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			description: "",
			tags: [],
			images: [],
			variants: [],
			categoryId: "",
		},
	});

	const { data: categoryTree } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

	const tableData: SellProduct[] = products.map((item) => ({
		...item,
		imgUrl: item.imgUrls[0],
	}));

	return {
		columns: getSellColumns({
			categoryTree,
			onDelete: async (id) => {
				await dispatch(removeUserProductAsync(id)).unwrap();

				toast("Product deleted.", { position: "top-center" });
			},
			locale,
			t,
		}),
		tableData,
		loading,

		initialConfig,
		form,

		options: useMemo(
			() => categoryTree?.flatMap((item) => [...item.children, item]) || [],
			[categoryTree],
		),

		createProduct: form.handleSubmit(async (data) => {
			const { name, description, tags, categoryId, images, options, variants } =
				data;

			const createProduct: CreateProduct = {
				name,
				description,
				imgFiles: images
					.filter((img) => !!img)
					.map((img) => img.file)
					.filter((img) => img !== undefined),
				tags,
				options: options.map((option, optionIndex) => ({
					name: option.name,
					position: optionIndex,
					values: option.values.map((value, valueIndex) => ({
						value,
						position: valueIndex,
					})),
				})),
				variants: variants.map((variant) => ({
					...variant,
					compareAtPrice: variant.price,
				})),
				categoryId,
				stock: 1,
			};

			await dispatch(createUserProductAsync(createProduct)).unwrap();

			toast("Product created.", { position: "top-center" });

			form.reset();

			router.push(localizePath("/store/products", locale));
		}),
		updateProduct: async ({ id, data }: { id: string; data: ProductInput }) => {
			const { name, description, tags, categoryId, images, options, variants } =
				data;

			const keptImgs: UpdateProduct["keptImgs"] = images
				.filter((img) => !!img)
				.map((img, index) => (img.url ? { url: img.url, index } : undefined))
				.filter((obj) => !!obj);

			const newImgs: UpdateProduct["newImgs"] = images
				.filter((img) => !!img)
				.map((img, index) => (img.file ? { file: img.file, index } : undefined))
				.filter((obj) => !!obj);

			const updateProduct: UpdateProduct = {
				name,
				description,
				tags,
				categoryId,
				options: options.map((option, optionIndex) => ({
					name: option.name,
					position: optionIndex,
					values: option.values.map((value, valueIndex) => ({
						value,
						position: valueIndex,
					})),
				})),
				variants: variants.map((variant) => {
					const variantImages = variant.images;

					const variantKeptImgs: UpdateProduct["keptImgs"] = variantImages
						.filter((img) => !!img)
						.map((img, index) =>
							img.url ? { url: img.url, index } : undefined,
						)
						.filter((obj) => !!obj);

					const variantNewImgs: UpdateProduct["newImgs"] = variantImages
						.filter((img) => !!img)
						.map((img, index) =>
							img.file ? { file: img.file, index } : undefined,
						)
						.filter((obj) => !!obj);

					return {
						...variant,
						compareAtPrice: variant.price,
						keptImgs: variantKeptImgs,
						newImgs: variantNewImgs,
					};
				}),
				keptImgs: keptImgs,
				newImgs: newImgs,
			};

			await dispatch(
				updateUserProductAsync({ id, data: updateProduct }),
			).unwrap();

			toast("Product updated.", { position: "top-center" });
		},
		onDescriptionChange: useDebouncedCallback(
			(editorState: string, isEmpty: boolean) => {
				form.setValue("description", isEmpty ? "" : editorState, {
					shouldValidate: true,
					shouldDirty: true,
				});
			},
			300,
		),

		description: useWatch({
			control: form.control,
			name: "description",
		}),
	};
}
