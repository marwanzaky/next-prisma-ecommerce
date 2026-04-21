import { useEffect } from "react";

import type { LexicalCommand } from "lexical";
import { $insertNodes,COMMAND_PRIORITY_LOW, PASTE_COMMAND } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { $createYouTubeNode } from "../nodes/youtube-node";

export default function YouTubePastePlugin(): null {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return editor.registerCommand<ClipboardEvent>(
			PASTE_COMMAND as LexicalCommand<ClipboardEvent>,
			(event: ClipboardEvent): boolean => {
				const text = event.clipboardData?.getData("text/plain") ?? undefined;

				if (!text) return false;

				const embedUrl = getYouTubeEmbedUrl(text);

				if (!embedUrl) return false;

				event.preventDefault();

				editor.update(() => {
					const node = $createYouTubeNode(embedUrl);
					$insertNodes([node]);
				});

				return true;
			},
			COMMAND_PRIORITY_LOW,
		);
	}, [editor]);

	return null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
	try {
		const parsed = new URL(url);

		if (
			parsed.hostname.includes("youtube.com") &&
			parsed.pathname.startsWith("/shorts/")
		) {
			const id = parsed.pathname.split("/shorts/")[1]?.split("/")[0];
			return id ? `https://www.youtube.com/embed/${id}` : null;
		}

		const videoId = parsed.searchParams.get("v");
		if (parsed.hostname.includes("youtube.com") && videoId) {
			return `https://www.youtube.com/embed/${videoId}`;
		}

		if (parsed.hostname === "youtu.be") {
			const id = parsed.pathname.replace("/", "");
			return id ? `https://www.youtube.com/embed/${id}` : null;
		}

		return null;
	} catch {
		return null;
	}
}
