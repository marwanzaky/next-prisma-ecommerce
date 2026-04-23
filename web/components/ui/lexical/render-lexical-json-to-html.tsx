import type {
	SerializedLexicalNode,
	SerializedParagraphNode,
	SerializedTextNode,
} from "lexical";

import { ImageNode, SerializedImageNode } from "./nodes/image-node";
import { SerializedYouTubeNode, YouTubeNode } from "./nodes/youtube-node";

export function renderLexicalJSONToHTML(
	nodes: SerializedLexicalNode[],
): string {
	return nodes
		.map((node) => {
			switch (node.type) {
				case "youtube":
					const youtubeNode = node as SerializedYouTubeNode;
					return YouTubeNode.exportHTML(youtubeNode.url);
				case "image":
					const imageNode = node as SerializedImageNode;
					return ImageNode.exportHTML(imageNode.src, imageNode.alt ?? "");
				case "paragraph":
					const paragraphNode = node as SerializedParagraphNode;
					const childrenHTML = paragraphNode.children
						? renderLexicalJSONToHTML(paragraphNode.children)
						: "";
					return `<p>${childrenHTML || "<br/>"}</p>`;
				case "linebreak":
					return "<br/>";
				case "text": {
					const textNode = node as SerializedTextNode;
					let text = textNode.text ?? "";
					const format = textNode.format ?? 0;

					if (format & 1) text = `<strong>${text}</strong>`;
					if (format & 2) text = `<em>${text}</em>`;
					if (format & 8) text = `<u>${text}</u>`;

					return text;
				}
				case "list": {
					const listNode = node as any;
					const tag = listNode.tag;
					return `<${tag}>${renderLexicalJSONToHTML(listNode.children)}</${tag}>`;
				}
				case "listitem": {
					const listItemNode = node as any;
					return `<li>${renderLexicalJSONToHTML(listItemNode.children)}</li>`;
				}
				default:
					return "";
			}
		})
		.join("");
}
