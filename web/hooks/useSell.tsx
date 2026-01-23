import { IProduct } from "_shared/interfaces";
import { Column } from "_shared/components/table";
import { LogoCell } from "_shared/components/table/cells/logoCell";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@redux/store";
import {
	postUserProductAsync,
	removeUserProductAsync,
	updateUserProductAsync,
} from "@redux/thunks/userProductsThunks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "_shared/shadcn/hooks/use-toast";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "_shared/shadcn/alertDialog";
import { ButtonIcon } from "_shared/ui/buttonIcon";
import { useForm } from "react-hook-form";

type CartItem = IProduct & { imgUrl: string };

type Inputs = {
	productId: string;
	name: string;
	description: string;
	priceRangeUsd: {
		min?: number;
		max?: number;
	};
	tags: string[];
	base64s: string[];
};

export function useSell() {
	const router = useRouter();
	const { toast } = useToast();

	const dispatch = useDispatch<AppDispatch>();

	const { isAuthenticated } = useAppSelector((state) => state.authReducer);
	const { products } = useAppSelector((state) => state.userProductsReducer);

	const {
		register,
		handleSubmit,
		formState: { errors },
		formState,
		control,
		reset,
	} = useForm<Inputs>({
		mode: "onTouched",
	});

	const [displayDialog, setDisplayDialog] = useState(false);
	const [displayEditDialog, setDisplayEditDialog] = useState(false);

	const columns: Column<CartItem>[] = [
		{
			header: "Product",
			field: "imgUrl",
			type: "custom",
			className: "w-[10%] md:w-[60%]",
			render: (value, row) => (
				<LogoCell href={`product/${row._id}`} label={row.name} imgUrl={value} />
			),
		},
		{ header: "Price", field: "price", type: "usd", width: "10%" },
		{
			header: "Compare",
			field: "priceCompare",
			type: "usd",
			width: "10%",
		},
		{
			header: "Stock",
			field: "stock",
			type: "number-input",
			width: "10%",
			onChange: (value, row) => {
				dispatch(
					updateUserProductAsync({
						id: row._id,
						data: {
							name: row.name,
							stock: value,
						},
					}),
				);
			},
		},
		{
			field: "_id",
			header: "",
			type: "custom",
			width: "38px",
			render(value, row) {
				return (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<ButtonIcon icon="delete" />
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the
									product data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										dispatch(removeUserProductAsync({ product: row, toast }));
									}}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				);
			},
		},
		{
			field: "_id",
			header: "",
			type: "action",
			width: "38px",
			action: (row) => {
				reset({
					productId: row._id,
					name: row.name,
					description: row.description,
					priceRangeUsd: {
						min: row.price / 100,
						max: row.priceCompare / 100,
					},
					base64s: row.imgUrls,
					tags: row.tags,
				});

				setDisplayEditDialog(true);
			},
			actionIcon: "edit",
		},
	];

	const tableData: CartItem[] = products.map((item) => ({
		...item,
		imgUrl: item.imgUrls[0],
	}));

	useEffect(() => {
		if (isAuthenticated === false) {
			router.push("/signin");
		}
	}, []);

	const onAddProduct = ({
		name,
		description,
		priceRangeUsd,
		tags,
		base64s,
	}: Inputs) => {
		if (priceRangeUsd.min && priceRangeUsd.max) {
			dispatch(
				postUserProductAsync({
					data: {
						name,
						description,
						price: priceRangeUsd.min * 100,
						priceCompare: priceRangeUsd.max * 100,
						imgUrls: base64s.filter(Boolean),
						tags,
						stock: 1,
					},
					toast,
				}),
			);
		}

		setDisplayDialog(false);

		resetForm();
	};

	const onUpdateProduct = ({
		productId,
		name,
		description,
		priceRangeUsd,
		tags,
		base64s,
	}: Inputs) => {
		if (priceRangeUsd.min && priceRangeUsd.max) {
			dispatch(
				updateUserProductAsync({
					id: productId,
					data: {
						name,
						description,
						price: priceRangeUsd.min * 100,
						priceCompare: priceRangeUsd.max * 100,
						imgUrls: base64s.filter(Boolean),
						tags,
					},
					toast,
				}),
			);
		}

		setDisplayEditDialog(false);

		resetForm();
	};

	const resetForm = () => {
		reset({
			name: "",
			description: "",
			priceRangeUsd: {
				min: undefined,
				max: undefined,
			},
			tags: [],
			base64s: [],
		});
	};

	return {
		products,

		columns,
		tableData,

		// Form
		register,
		errors,
		formState,
		handleSubmit,
		control,
		resetForm,

		displayDialog,
		setDisplayDialog,
		displayEditDialog,
		setDisplayEditDialog,

		onAddProduct,
		onUpdateProduct,
	};
}
