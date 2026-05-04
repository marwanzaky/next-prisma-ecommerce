import { $insertNodes, FORMAT_TEXT_COMMAND, TextFormatType } from "lexical";
import { Bold, ImageIcon, Italic, List, ListOrdered } from "lucide-react";

import {
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { uploadsService } from "@/services/uploads-service";

import { $createImageNode } from "@/components/ui/lexical/nodes/image-node";

import { Button } from "@/shadcn/components/ui/button";
import { Separator } from "@/shadcn/components/ui/separator";

import { cn } from "@/lib/utils";

export function ImageToolbarButtonPlugin() {
	const [editor] = useLexicalComposerContext();

	const onFormat = (format: TextFormatType) => {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
	};

	const insertImage = async () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.click();

		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;

			try {
				const url = await uploadsService.uploadFile(file);

				editor.update(() => {
					const imageNode = $createImageNode(url, file.name);
					$insertNodes([imageNode]);
				});
			} catch (err) {
				console.error("Image upload failed:", err);
			}
		};
	};

	return (
		<div className="sticky top-0 z-20">
			<ToolbarGroup>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => onFormat("bold")}
					className="h-8 w-8 p-0"
				>
					<Bold className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => onFormat("italic")}
					className="h-8 w-8 p-0"
				>
					<Italic className="h-4 w-4" />
				</Button>

				<Separator orientation="vertical" />

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() =>
						editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
					}
					className="h-8 w-8 p-0"
				>
					<List className="h-4 w-4" />
				</Button>

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() =>
						editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
					}
					className="h-8 w-8 p-0"
				>
					<ListOrdered className="h-4 w-4" />
				</Button>

				<Separator orientation="vertical" />

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={insertImage}
					className="h-8 w-8 p-0"
				>
					<ImageIcon className="h-4 w-4" />
				</Button>
			</ToolbarGroup>
		</div>
	);
}

export function ToolbarGroup({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex items-center gap-1 p-1 border-b", className)}>
			{children}
		</div>
	);
}
