import { JSX } from "react";

import Image from "next/image";

import { DecoratorNode, NodeKey, SerializedLexicalNode } from "lexical";

export type SerializedImageNode = SerializedLexicalNode & {
	type: "image";
	src: string;
	alt?: string;
};

export class ImageNode extends DecoratorNode<JSX.Element> {
	__src: string;
	__alt: string;

	static getType() {
		return "image";
	}

	static clone(node: ImageNode) {
		return new ImageNode(node.__src, node.__alt, node.__key);
	}

	constructor(src: string = "", alt: string = "", key?: NodeKey) {
		super(key);
		this.__src = src;
		this.__alt = alt;
	}

	static importJSON(serializedNode: SerializedImageNode) {
		const { src, alt } = serializedNode;
		return new ImageNode(src, alt);
	}

	exportJSON(): SerializedImageNode {
		return {
			type: "image",
			version: 1,
			src: this.__src,
			alt: this.__alt,
		};
	}

	static exportHTML(src: string, alt: string): string {
		return `<img src="${src}" alt="${alt ?? ""}" />`;
	}

	createDOM() {
		return document.createElement("div");
	}

	updateDOM() {
		return false;
	}

	decorate() {
		return (
			<Image
				src={this.__src}
				alt={this.__alt}
				width={512}
				height={512}
				className="rounded-lg w-full"
			/>
		);
	}
}

export function $createImageNode(src: string, alt?: string) {
	return new ImageNode(src, alt);
}
