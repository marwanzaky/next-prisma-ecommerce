import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import * as z from "zod";
import { useDebouncedCallback } from "use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";

import { LineBreakNode, ParagraphNode } from "lexical";
import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";

import { AppDispatch, useAppSelector } from "@/redux/store";
import {
	postUserProductAsync,
	removeUserProductAsync,
	updateUserProductAsync,
} from "@/redux/thunks/user-products-thunks";
import { categoriesService } from "@/redux/services/categories-service";

import { ICreateProduct, IUpdateProduct } from "@/types/product.type";

import { ImageNode } from "@/shared/components/ui/lexical/nodes/image-node";
import { YouTubeNode } from "@/shared/components/ui/lexical/nodes/youtube-node";

import { getSellColumns, SellProduct } from "./columns";

import { useI18n } from "@/components/layout/i18n-provider";
import { localizePath } from "@/lib/i18n";

export const productSchema = z.object({
	name: z
		.string()
		.nonempty("This field is required.")
		.min(2, "Name is too short.")
		.max(120, "Name is too long."),
	description: z.string().nonempty("This field is required."),
	category: z.string().nonempty("This field is required."),
	priceRangeUsd: z
		.object({
			min: z.number("This field is required.").positive(),
			max: z.number().positive(),
		})
		.refine((data) => !data.max || data.max >= data.min, {
			message: "Max price must be greater than min price",
			path: ["max"],
		}),
	tags: z.array(z.string()).min(1, "This field is required."),
	images: z
		.array(
			z
				.object({
					url: z.string().optional(),
					file: z.instanceof(File).optional(),
				})
				.optional(),
		)
		.optional(),
});

export type ProductForm = z.infer<typeof productSchema>;

export function useSell() {
	const router = useRouter();

	const dispatch = useDispatch<AppDispatch>();

	const { locale } = useI18n();

	const { products, loading } = useAppSelector(
		(state) => state.userProductsReducer,
	);

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

	const form = useForm<ProductForm>({
		resolver: zodResolver(productSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			description: "",
			priceRangeUsd: {
				min: undefined,
				max: undefined,
			},
			tags: [],
			images: [],
			category: "",
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
			onDelete: (id) => {
				dispatch(removeUserProductAsync({ id }));
			},
			onStockChange: (id, value) => {
				const product = products.find((p) => p._id === id);

				dispatch(
					updateUserProductAsync({
						id,
						data: {
							stock: value,
							keptImgs: product
								?.imgUrls!.map((imgUrl, index) =>
									imgUrl ? { url: imgUrl, index } : null,
								)
								.filter((el) => el !== null),
						},
					}),
				);
			},
			locale,
		}),
		tableData,
		loading,

		initialConfig,
		form,

		options: useMemo(
			() => categoryTree?.flatMap((item) => [...item.children, item]) || [],
			[categoryTree],
		),

		addProduct: form.handleSubmit(async (data) => {
			const { priceRangeUsd, name, description, tags, category, images } = data;

			const createProduct: ICreateProduct = {
				name,
				description,
				price: priceRangeUsd.min * 100,
				priceCompare: priceRangeUsd.max * 100,
				imgFiles:
					images &&
					images
						.filter(Boolean)
						.map((img) => img!.file)
						.filter((img) => img !== undefined),
				tags,
				category,
				stock: 1,
			};

			await dispatch(
				postUserProductAsync({
					data: createProduct,
				}),
			);

			form.reset();

			router.push(localizePath("/store/products", locale));
		}),
		updateProduct: ({ id, data }: { id: string; data: ProductForm }) => {
			const { priceRangeUsd, name, description, tags, category, images } = data;

			const newImgs = images!
				.map((img, index) => (img?.file ? { file: img.file, index } : null))
				.filter((el) => el !== null);

			const keptImgs = images!
				.map((img, index) => (img?.url ? { url: img.url, index } : null))
				.filter((el) => el !== null);

			const updatedProduct: IUpdateProduct = {
				name,
				description,
				price: priceRangeUsd.min * 100,
				priceCompare: priceRangeUsd.max! * 100,
				newImgs,
				keptImgs,
				tags,
				category,
			};

			dispatch(updateUserProductAsync({ id, data: updatedProduct }));
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
