import React from "react";

import { DecoratorNode, NodeKey, SerializedLexicalNode } from "lexical";

export type SerializedYouTubeNode = SerializedLexicalNode & {
	type: "youtube";
	url: string;
};

export class YouTubeNode extends DecoratorNode<React.ReactNode> {
	__url: string;

	static getType(): string {
		return "youtube";
	}

	static clone(node: YouTubeNode): YouTubeNode {
		return new YouTubeNode(node.__url, node.__key);
	}

	static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
		return new YouTubeNode(serializedNode.url);
	}

	exportJSON(): SerializedYouTubeNode {
		return {
			type: "youtube",
			version: 1,
			url: this.__url,
		};
	}
	static exportHTML(url: string): string {
		return `<iframe src=${url} class="w-full max-w-80 aspect-9/16 shadow rounded-lg" frameBorder={0} allowFullScreen></iframe>`;
	}

	constructor(url: string, key?: NodeKey) {
		super(key);
		this.__url = url;
	}

	createDOM(): HTMLElement {
		return document.createElement("div");
	}

	updateDOM(): false {
		return false;
	}

	decorate(): React.ReactNode {
		return (
			<iframe
				src={this.__url}
				className="w-full max-w-40 aspect-9/16 shadow rounded-lg"
				frameBorder={0}
				allowFullScreen
			/>
		);
	}
}

export function $createYouTubeNode(url: string): YouTubeNode {
	return new YouTubeNode(url);
}
