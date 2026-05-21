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
		priceRangeUsd: z
			.object({
				min: z
					.number({ error: t("validation.required") })
					.positive(t("validation.mustBePositive")),
				max: z
					.number({ error: t("validation.invalidNumber") })
					.positive(t("validation.mustBePositive")),
			})
			.refine((data) => !data.max || data.max >= data.min, {
				message: t("validation.maxPriceGteMinPrice"),
				path: ["max"],
			}),
		tags: z.array(z.string()).min(1, t("validation.required")),
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
			priceRangeUsd: {
				min: undefined,
				max: undefined,
			},
			tags: [],
			images: [],
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
			onStockChange: (id, value) =>
				dispatch(
					updateUserProductAsync({
						id,
						data: {
							stock: value,
						},
					}),
				),
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

		addProduct: form.handleSubmit(async (data) => {
			const { priceRangeUsd, name, description, tags, categoryId, images } =
				data;

			const createProduct: CreateProduct = {
				name,
				description,
				price: priceRangeUsd.min * 100,
				priceCompare: priceRangeUsd.max * 100,
				imgFiles: images
					.filter((img) => !!img)
					.map((img) => img.file)
					.filter((img) => img !== undefined),
				tags,
				categoryId,
				stock: 1,
			};

			await dispatch(createUserProductAsync(createProduct)).unwrap();

			toast("Product created.", { position: "top-center" });

			form.reset();

			router.push(localizePath("/store/products", locale));
		}),
		updateProduct: async ({ id, data }: { id: string; data: ProductInput }) => {
			const { priceRangeUsd, name, description, tags, categoryId, images } =
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
				price: priceRangeUsd.min * 100,
				priceCompare: priceRangeUsd.max * 100,
				tags,
				categoryId,
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
