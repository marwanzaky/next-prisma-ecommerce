import { Injectable } from "@nestjs/common";

import { PublicCategoryTree } from "@repo/database";
import { TranslatedText } from "@repo/types";

import { PrismaService } from "@/prisma.service";

@Injectable()
export class CategoriesService {
	constructor(private prisma: PrismaService) {}

	async getPublicCategoryTree(): Promise<PublicCategoryTree[]> {
		const categories = await this.prisma.category.findMany({
			where: { isActive: true },
			select: {
				id: true,
				name: true,
				slug: true,
				imgUrl: true,
				parentId: true,
				_count: {
					select: { products: true },
				},
			},
		});

		const categoryMap = new Map<string, PublicCategoryTree>();

		categories.forEach((cat) => {
			categoryMap.set(cat.id, {
				id: cat.id,
				name: cat.name as TranslatedText,
				slug: cat.slug,
				imgUrl: cat.imgUrl,
				productCount: cat._count.products,
				children: [],
			});
		});

		const tree: PublicCategoryTree[] = [];

		categories.forEach((cat) => {
			const currentItem = categoryMap.get(cat.id);
			if (!currentItem) return;

			if (cat.parentId) {
				const parentItem = categoryMap.get(cat.parentId);
				if (parentItem) {
					parentItem.children.push(currentItem);
					parentItem.productCount += currentItem.productCount;
				}
			} else {
				tree.push(currentItem);
			}
		});

		return tree;
	}

	async getAllDescendantCategoryIds(categoryId: string): Promise<string[]> {
		const resultIds: string[] = [];

		const stack: string[] = [categoryId];

		while (stack.length > 0) {
			const currentId = stack.pop()!;
			resultIds.push(currentId);

			const children = await this.prisma.category.findMany({
				where: {
					parentId: currentId,
				},
				select: {
					id: true,
				},
			});

			for (const child of children) {
				stack.push(child.id);
			}
		}

		return resultIds;
	}
}
