import { BadRequestException, Injectable } from "@nestjs/common";

import { Prisma } from "@repo/database";

import { CategoriesService } from "@/services/categories/categories.service";
import { CloudinaryService } from "@/services/cloudinary/cloudinary.service";

import { PrismaService } from "@/prisma.service";

@Injectable()
export class ProductsService {
	constructor(
		private prisma: PrismaService,
		private categoriesService: CategoriesService,
		private cloudinaryService: CloudinaryService,
	) {}

	/**
	 * Returns ProductEntity document
	 */
	async find(options: {
		where?: Prisma.ProductWhereInput;
		orderBy?:
			| Prisma.ProductOrderByWithRelationInput
			| Prisma.ProductOrderByWithRelationInput[]
			| undefined;
		take?: number;
		searchName?: string;
	}) {
		const { where = {}, orderBy, take, searchName } = options;

		if (searchName) {
			where.OR = [
				...(where.OR || []),
				...["en", "fr", "ar"].map((lang) => ({
					name: {
						path: [lang],
						string_contains: searchName,
					},
				})),
			];
		}

		return this.prisma.product.findMany({
			where,
			orderBy,
			take,
		});
	}

	async calcAvgRatings(productId: string): Promise<void> {
		const stats = await this.prisma.review.aggregate({
			where: {
				productId: productId,
			},
			_count: {
				id: true,
			},
			_avg: {
				rating: true,
			},
		});

		const numReviews = stats._count.id ?? 0;
		const avgRatings = stats._avg.rating ?? 0;

		await this.prisma.product.update({
			where: { id: productId },
			data: {
				numReviews: numReviews,
				avgRatings: avgRatings,
			},
		});
	}

	async calcRatingDistribution(productId: string): Promise<void> {
		const distribution = await this.prisma.review.groupBy({
			by: ["rating"],
			where: {
				productId: productId,
			},
			_count: {
				id: true,
			},
		});

		const ratingDistribution: Record<number, number> = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
		};

		distribution.forEach((item) => {
			if (item.rating >= 1 && item.rating <= 5) {
				ratingDistribution[item.rating] = item._count.id;
			}
		});

		await this.prisma.product.update({
			where: { id: productId },
			data: {
				ratingDistribution:
					ratingDistribution as unknown as Prisma.InputJsonValue,
			},
		});
	}

	async buildPatchedImgUrls(
		existingImgUrls: string[],
		keptImgs:
			| {
					url: string;
					index: number;
			  }[]
			| undefined,
		newImgs: {
			imgFiles: Express.Multer.File[];
			newImgIndices: number[] | undefined;
		},
	): Promise<string[]> {
		const { imgFiles, newImgIndices } = newImgs;

		const slots: Array<string | null> = Array.from({ length: 10 }).map(
			() => null,
		);

		const usedIndices = new Set<number>();

		if (keptImgs) {
			for (const img of keptImgs) {
				if (
					!img ||
					typeof img.url !== "string" ||
					typeof img.index !== "number"
				) {
					throw new BadRequestException("Invalid keptImgs item");
				}
				if (img.index < 0 || img.index > 9)
					throw new BadRequestException("Image index out of range");
				if (!existingImgUrls.includes(img.url))
					throw new BadRequestException("keptImgs includes unknown url");

				slots[img.index] = img.url;
				usedIndices.add(img.index);
			}
		}

		if (imgFiles.length > 0) {
			if (!newImgIndices)
				throw new BadRequestException(
					"newImgIndices is required with imgFiles",
				);

			for (const index of newImgIndices) {
				if (typeof index !== "number" || Number.isNaN(index))
					throw new BadRequestException("Invalid newImgIndices item");
				if (index < 0 || index > 9)
					throw new BadRequestException("Image index out of range");
				if (usedIndices.has(index))
					throw new BadRequestException("Duplicate image index");
				usedIndices.add(index);
			}

			const uploadedUrls = await Promise.all(
				imgFiles.map((file) => this.cloudinaryService.uploadFile(file)),
			);
			const definedUploadedUrls = uploadedUrls.filter(
				(el): el is string => typeof el === "string",
			);

			if (definedUploadedUrls.length !== imgFiles.length) {
				throw new BadRequestException("Failed to upload one or more images");
			}

			for (let i = 0; i < newImgIndices.length; i++) {
				slots[newImgIndices[i]] = definedUploadedUrls[i];
			}
		}

		const finalUrls = slots.filter((url): url is string => Boolean(url));

		if (finalUrls.length > 10) {
			throw new BadRequestException("Max 10 images");
		}

		return finalUrls;
	}
}
