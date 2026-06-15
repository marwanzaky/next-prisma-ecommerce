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

import { getKeptAndNewImgs } from "@/lib/helper";
import { localizePath } from "@/lib/i18n";
import { createVariant } from "@/lib/variants";

import { getSellColumns, SellProduct } from "./columns";
import { createProductSchema } from "./schemas";

export type ProductInput = z.infer<ReturnType<typeof createProductSchema>>;

export function useSell() {
	const router = useRouter();

	const dispatch = useAppDispatch();

	const { locale, t } = useI18n();
	const productSchema = createProductSchema(t);

	const { products } = useAppSelector((state) => state.userProducts);

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
			variants: [
				createVariant({ title: "Untitled", baseSku: "", selections: [] }),
			],
			options: [],
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
		imgUrl: item.variants[0].imgUrls[0],
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

		initialConfig,
		form,

		options: useMemo(
			() => categoryTree?.flatMap((item) => [...item.children, item]) || [],
			[categoryTree],
		),

		createProduct: form.handleSubmit(
			async (data) => {
				const { name, description, tags, categoryId, options, variants } = data;

				const createProduct: CreateProduct = {
					name,
					description,
					tags,
					options: options.map((option, optionIndex) => ({
						name: option.name,
						position: optionIndex,
						values: option.values.map((value, valueIndex) => ({
							value,
							position: valueIndex,
						})),
					})),
					variants: variants.map((variant) => {
						const { keptImgs, newImgs } = getKeptAndNewImgs(variant.images);

						return {
							...variant,
							price: variant.priceRangeUsd.min * 100,
							compareAtPrice: variant.priceRangeUsd.max * 100,
							keptImgs,
							newImgs,
						};
					}),
					categoryId,
					stock: 1,
				};

				await dispatch(createUserProductAsync(createProduct)).unwrap();

				toast("Product created.", { position: "top-center" });

				form.reset();

				router.push(localizePath("/store/products", locale));
			},
			(e) => console.log(e),
		),
		updateProduct: async ({ id, data }: { id: string; data: ProductInput }) => {
			const { name, description, tags, categoryId, options, variants } = data;

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
					const { keptImgs, newImgs } = getKeptAndNewImgs(variant.images);

					return {
						...variant,
						price: variant.priceRangeUsd.min * 100,
						compareAtPrice: variant.priceRangeUsd.max * 100,
						keptImgs,
						newImgs,
					};
				}),
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
