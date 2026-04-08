import { AppDispatch } from "@redux/store";
import {
	removeUserProductAsync,
	updateUserProductAsync,
} from "@redux/thunks/user-products-thunks";
import { Column } from "@shared/components/ui/table";
import { LogoCell } from "@shared/components/ui/table/cells/logo-cell";
import { IProduct } from "@shared/interfaces";
import { createProductSlug } from "@utils/string-utils";

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
} from "@shadcn/components/ui/alert-dialog";
import { ButtonIcon } from "@shared/components/ui/button-icon";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type SellProduct = IProduct & { imgUrl: string };

export const getSellColumns = ({
	dispatch,
	router,
}: {
	dispatch: AppDispatch;
	router: AppRouterInstance;
}): Column<SellProduct>[] => [
	{
		header: "Product",
		field: "imgUrl",
		type: "custom",
		className: "w-auto md:w-[60%]",
		render: (value, row) => (
			<LogoCell
				href={`products/${createProductSlug(row.name, row._id)}`}
				label={row.name}
				imgUrl={value}
			/>
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
		className: "w-21",
		render(value, row) {
			return (
				<div className="flex gap-2">
					<ButtonIcon
						icon="edit"
						aria-label="Edit product"
						onClick={async () => {
							router.push(`/store/products/${row._id}`);
						}}
					/>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<ButtonIcon icon="delete" aria-label="Delete product" />
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
										dispatch(removeUserProductAsync({ product: row }));
									}}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			);
		},
	},
];
