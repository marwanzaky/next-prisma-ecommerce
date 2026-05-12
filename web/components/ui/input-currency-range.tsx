"use client";

import clsx from "clsx";

import { useI18n } from "../layout/i18n-provider";
import { InputCurrency } from "./Input-currency";

type InputCurrencyRangeProps = {
	className?: string;
	minPlaceholder?: string;
	maxPlaceholder?: string;
	minValue?: number | undefined;
	maxValue?: number | undefined;
	onMinChange: (value: number | undefined) => void;
	onMaxChange: (value: number | undefined) => void;
	required?: boolean;
};

export function InputCurrencyRange({
	className,
	minPlaceholder,
	maxPlaceholder,
	minValue,
	maxValue,
	onMinChange,
	onMaxChange,
	required,
}: InputCurrencyRangeProps) {
	const { t } = useI18n();

	return (
		<div className={clsx("flex gap-4", className)}>
			<InputCurrency
				placeholder={minPlaceholder || t("from")}
				onChange={onMinChange}
				value={minValue}
				required={required}
			/>

			<InputCurrency
				placeholder={maxPlaceholder || t("to")}
				onChange={onMaxChange}
				value={maxValue}
				required={required}
			/>
		</div>
	);
}
