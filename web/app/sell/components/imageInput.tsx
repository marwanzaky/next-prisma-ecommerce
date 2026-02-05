"use client";

import { useRef } from "react";

import Icon from "_shared/ui/icon";
import { ButtonIcon } from "_shared/ui/buttonIcon";

type ImageSlot = {
	url?: string;
	file?: File;
};

type ImageInputProps = {
	value?: ImageSlot;
	onChange?: (value: ImageSlot) => void;
};

export default function ImageInput({ value, onChange }: ImageInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const previewUrl = value?.file ? URL.createObjectURL(value.file) : value?.url;

	return (
		<div className="relative">
			{previewUrl && (
				<ButtonIcon
					icon="close"
					className="absolute -top-4 -right-4 z-10 scale-50 border-2"
					onClick={() => onChange?.({ file: undefined, url: undefined })}
				/>
			)}

			<div className="w-full h-16 rounded-xl overflow-hidden outline-none shadow-[0_0_0_1pt_#ecf0f1] focus:shadow-[0_0_0_2pt_cornflowerblue]">
				<input
					ref={inputRef}
					type="file"
					className="hidden"
					accept=".png,.jpg,.jpeg"
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (!file) return;

						if (file.size > 4 * 1024 * 1024) {
							alert("Image size exceeds 4MB");
							return;
						}

						onChange?.({
							file,
							url: undefined,
						});

						e.target.value = "";
					}}
				/>

				{previewUrl ? (
					<img
						role="button"
						className="h-full w-full"
						src={previewUrl}
						onClick={() => inputRef.current?.click()}
					/>
				) : (
					<div
						role="button"
						className="h-full w-full bg-custom-background-foreground flex justify-center items-center"
						onClick={() => inputRef.current?.click()}
					>
						<Icon className="filter-custom-placeholder" icon="upload_file" />
					</div>
				)}
			</div>
		</div>
	);
}
