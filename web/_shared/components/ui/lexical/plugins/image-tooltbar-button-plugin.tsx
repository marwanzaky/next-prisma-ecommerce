import { $createImageNode } from "@shared/components/ui/lexical/nodes/image-node";

import { $insertNodes } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { cn } from "@lib/utils";
import { Button } from "@shadcn/components/ui/button";
import { ImageIcon } from "lucide-react";
import { uploadsService } from "@redux/services/uploads-service";

export function ImageToolbarButtonPlugin() {
	const [editor] = useLexicalComposerContext();

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
