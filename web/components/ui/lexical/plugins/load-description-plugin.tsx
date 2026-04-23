import { useEffect, useRef } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
	$createImageNode,
	ImageNode,
} from "@/components/ui/lexical/nodes/image-node";

export function LoadDescriptionPlugin({ json }: { json?: string }) {
	const [editor] = useLexicalComposerContext();
	const loaded = useRef(false);

	useEffect(() => {
		if (!json) return;
		if (loaded.current) return;

		loaded.current = true;

		editor.update(() => {
			const parsed = JSON.parse(json);
			const editorState = editor.parseEditorState(parsed);
			editor.setEditorState(editorState);
		});
	}, [editor, json]);

	return null;
}

ImageNode.importDOM = () => ({
	img: () => ({
		conversion: (domNode: HTMLElement) => {
			const img = domNode as HTMLImageElement;
			return {
				node: $createImageNode(img.src, img.alt ?? ""),
			};
		},
		priority: 0,
	}),
});
