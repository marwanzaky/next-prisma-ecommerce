import { useEffect } from "react";

import { $getRoot } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function OnChangePlugin({
	onChange,
}: {
	onChange: (html: string, isEmpty: boolean) => void;
}) {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const root = $getRoot();
				const isEmpty = root.getTextContent().trim().length === 0;
				onChange(JSON.stringify(editorState.toJSON()), isEmpty);
			});
		});
	}, [editor, onChange]);

	return null;
}
