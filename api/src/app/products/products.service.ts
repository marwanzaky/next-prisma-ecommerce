import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";

import {
	Prisma,
	ProductWithVariantsReviewsUser,
	productWithVariantsReviewsUser,
} from "@repo/database";
import { Locale, TranslatedText } from "@repo/types";

import { CategoriesService } from "@/services/categories/categories.service";
import { CloudinaryService } from "@/services/cloudinary/cloudinary.service";
import { TranslationService } from "@/services/translation/translation.service";

import { PrismaService } from "@/prisma.service";

import { CreateProductDto } from "./dto/create-product.dto";
import { GetAllProductsDto } from "./dto/get-all-products.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateProductVariantDto } from "./dto/update-product-variant.dto";

@Injectable()
export class ProductsService {
	private defaultLocale: Locale;

	constructor(
		private prisma: PrismaService,
		private categoriesService: CategoriesService,
		private cloudinaryService: CloudinaryService,
		private translationService: TranslationService,
	) {
		this.defaultLocale = process.env.DEFAULT_LOCALE as Locale;
	}

	async findMany(
		options: GetAllProductsDto,
	): Promise<ProductWithVariantsReviewsUser[]> {
		const {
			sortProperty,
			sortOrder,
			name,
			excludeIds,
			minPrice,
			maxPrice,
			featured,
			limit,
			avgRatings,
			categoryId,
		} = options;

		const where: Prisma.ProductWhereInput = {};

		let orderBy:
			| Prisma.ProductOrderByWithRelationInput
			| Prisma.ProductOrderByWithRelationInput[]
			| undefined;

		if (avgRatings !== undefined) {
			where.avgRatings = {
				gte: Number(avgRatings),
			};
		}

		if (name !== undefined) {
			where.OR = [
				{
					name: {
						path: ["en"],
						string_contains: name,
						mode: "insensitive",
					},
				},
				{
					name: {
						path: ["ar"],
						string_contains: name,
						mode: "insensitive",
					},
				},
				{
					name: {
						path: ["fr"],
						string_contains: name,
						mode: "insensitive",
					},
				},
			];
		}

		if (categoryId !== undefined) {
			where.categoryId = {
				in: await this.categoriesService.getAllDescendantCategoryIds(
					categoryId,
				),
			};
		}

		if (excludeIds !== undefined) {
			where.id = {
				notIn: excludeIds,
			};
		}

		if (avgRatings !== undefined) {
			where.avgRatings = {
				gte: avgRatings,
			};
		}

		if (minPrice !== undefined || maxPrice !== undefined) {
			where.variants = {
				some: {
					price: {
						...(minPrice !== undefined && { gte: Number(minPrice) }),
						...(maxPrice !== undefined && { lte: Number(maxPrice) }),
					},
				},
			};
		}

		if (sortProperty) {
			orderBy = {
				[sortProperty]: sortOrder === "desc" ? "desc" : "asc",
			};
		}

		if (sortProperty === "price") {
			orderBy = {
				variants: {
					_count: sortOrder === "desc" ? "desc" : "asc",
				},
			};
		} else if (sortProperty) {
			orderBy = {
				[sortProperty]: sortOrder === "desc" ? "desc" : "asc",
			};
		}

		return this.prisma.product.findMany({
			where: {
				...where,
				featured,
			},
			orderBy,
			take: limit,
			...productWithVariantsReviewsUser,
		});
	}

	async create(
		userId: string,
		params: CreateProductDto,
	): Promise<ProductWithVariantsReviewsUser | null> {
		const {
			name,
			description,
			shortDescription,
			tags,
			categoryId,
			options,
			variants,
		} = params;

		return this.prisma.$transaction(async (tx) => {
			const product = await tx.product.create({
				data: {
					name: await this.translationService.translateText(name),
					description: await this.translationService.translateJson(description),
					shortDescription: shortDescription
						? await this.translationService.translateJson(shortDescription)
						: undefined,
					ratingDistribution: {
						"1": 0,
						"2": 0,
						"3": 0,
						"4": 0,
						"5": 0,
					},
					tags,
					userId,
					categoryId,
				},
			});

			const optionMap = new Map<string, Prisma.ProductOptionModel>();
			const valueMap = new Map<string, Prisma.ProductOptionValueModel>();

			for (const option of options) {
				const createdOption = await tx.productOption.create({
					data: {
						name: option.name,
						productId: product.id,
						position: option.position,
					},
				});

				optionMap.set(option.name, createdOption);

				for (const value of option.values) {
					const createdValue = await tx.productOptionValue.create({
						data: {
							optionId: createdOption.id,
							value: value.value,
							position: value.position,
						},
					});

					valueMap.set(`${option.name}:${value.value}`, createdValue);
				}
			}

			for (const variant of variants) {
				const createdVariant = await tx.productVariant.create({
					data: {
						productId: product.id,
						title: variant.title,
						price: variant.price,
						compareAtPrice: variant.compareAtPrice,
						stock: variant.stock,
						sku: variant.sku,
					},
				});

				for (const selection of variant.selections) {
					const option = optionMap.get(selection.optionName);

					if (!option) {
						throw new Error(`Invalid option: ${selection.optionName}`);
					}

					const optionValue = valueMap.get(
						`${selection.optionName}:${selection.optionValue}`,
					);

					if (!optionValue) {
						throw new Error(
							`Invalid option value: ${selection.optionName} -> ${selection.optionValue}`,
						);
					}

					await tx.variantSelection.create({
						data: {
							variantId: createdVariant.id,
							optionId: option.id,
							optionValueId: optionValue.id,
						},
					});
				}
			}

			return tx.product.findUnique({
				where: { id: product.id },
				...productWithVariantsReviewsUser,
			});
		});
	}

	async update(
		id: string,
		userId: string,
		params: UpdateProductDto,
		imgFiles: Express.Multer.File[],
	): Promise<ProductWithVariantsReviewsUser> {
		const {
			name,
			description,
			shortDescription,
			tags,
			categoryId,
			keptImgs,
			newImgIndices,
			options,
			variants,
		} = params;

		const existingProduct = await this.prisma.product.findUnique({
			where: { id },
		});

		if (!existingProduct) {
			throw new NotFoundException("Product not found");
		}

		if (existingProduct.userId !== userId) {
			throw new UnauthorizedException("Not allowed");
		}

		if (newImgIndices && imgFiles.length !== newImgIndices.length) {
			throw new BadRequestException(
				"newImgIndices length must match imgFiles length",
			);
		}

		let translatedName: TranslatedText | undefined;
		if (
			name !== undefined &&
			(existingProduct.name as TranslatedText)[this.defaultLocale] !== name
		) {
			translatedName = await this.translationService.translateText(name);
		}

		let translatedDescription: TranslatedText | undefined;
		if (
			description !== undefined &&
			(existingProduct.description as TranslatedText)[this.defaultLocale] !==
				description
		) {
			translatedDescription =
				await this.translationService.translateJson(description);
		}

		let translatedShortDescription: TranslatedText | undefined;
		if (
			shortDescription !== undefined &&
			(existingProduct.shortDescription as TranslatedText)[
				this.defaultLocale
			] !== shortDescription
		) {
			translatedShortDescription =
				await this.translationService.translateJson(shortDescription);
		}

		const imgUrls =
			keptImgs || newImgIndices
				? await this.buildPatchedImgUrls(existingProduct.imgUrls, keptImgs, {
						imgFiles,
						newImgIndices: newImgIndices,
					})
				: undefined;

		return this.prisma.$transaction(
			async (tx) => {
				// 1. Delete current options that no longer exist in the incoming options
				const currentOptions = await tx.productOption.findMany({
					where: { productId: id },
					include: { values: true },
				});

				const incomingOptionNames = options.map((o) => o.name);

				const currentOptionsToDelete = currentOptions.filter(
					(curOption) => !incomingOptionNames.includes(curOption.name),
				);

				if (currentOptionsToDelete.length > 0) {
					await tx.productOption.deleteMany({
						where: {
							id: {
								in: currentOptionsToDelete.map((curOption) => curOption.id),
							},
						},
					});
				}

				// 2. UPSERT / SYNC: Loop over incoming options
				if (options) {
					for (const incomingOption of options) {
						// Find if this option already exists for the product
						let targetOption = currentOptions.find(
							(curOption) => curOption.name === incomingOption.name,
						);

						if (targetOption) {
							// Optionally update its configuration/position if changed
							targetOption = await tx.productOption.update({
								where: { id: targetOption.id },
								data: { position: incomingOption.position },
								include: { values: true },
							});
						} else {
							// Create it if it's completely new
							targetOption = await tx.productOption.create({
								data: {
									name: incomingOption.name,
									productId: id,
									position: incomingOption.position,
								},
								include: { values: true }, // Empty initially
							});
						}

						// --- Synchronize Values for this specific Option ---
						const currentValues = targetOption.values;
						const incomingValueStrings = incomingOption.values.map(
							(v) => v.value,
						);

						// A. Prune old values missing from the incoming array
						const valuesToDelete = currentValues.filter(
							(curValue) => !incomingValueStrings.includes(curValue.value),
						);

						if (valuesToDelete.length > 0) {
							await tx.productOptionValue.deleteMany({
								where: {
									id: { in: valuesToDelete.map((v) => v.id) },
								},
							});
						}

						// B. Add new values that don't exist yet
						for (const incomingVal of incomingOption.values) {
							const valueExists = currentValues.some(
								(dbVal) => dbVal.value === incomingVal.value,
							);

							if (valueExists) {
								// Optionally refresh positions for existing values
								await tx.productOptionValue.updateMany({
									where: {
										optionId: targetOption.id,
										value: incomingVal.value,
									},
									data: { position: incomingVal.position },
								});
							} else {
								await tx.productOptionValue.create({
									data: {
										optionId: targetOption.id,
										value: incomingVal.value,
										position: incomingVal.position,
									},
								});
							}
						}
					}
				}

				// --- [STEP 3: Synchronize Variants Matrix] ---
				if (params.variants) {
					// Fetch variants currently attached to the product in DB
					const existingVariants = await tx.productVariant.findMany({
						where: { productId: id },
						include: { selections: true },
					});

					// 1. Identify Deletions
					// If a variant coming from the frontend doesn't have an ID, or its signature is gone, drop it
					const incomingVariantIds = params.variants
						.map((variant) => variant.variantId)
						.filter(Boolean) as string[];

					const variantsToDelete = existingVariants.filter(
						(dbVar) => !incomingVariantIds.includes(dbVar.id),
					);

					if (variantsToDelete.length > 0) {
						await tx.productVariant.deleteMany({
							where: {
								id: { in: variantsToDelete.map((variant) => variant.id) },
							},
						});
					}

					// 2. Process Upserts (Create new ones or Update mutated data)
					for (const incomingVariant of params.variants) {
						let variantImgUrls: string[] | undefined = undefined;

						if (incomingVariant.variantId) {
							// Fetch the specific variant's previous image record for patching
							const currentDbVariant = existingVariants.find(
								(v) => v.id === incomingVariant.variantId,
							);
							const baseUrls = currentDbVariant?.imgUrls || []; // Assuming your DB field is called imgUrls

							variantImgUrls =
								incomingVariant.keptImgs || incomingVariant.newImgIndices
									? await this.buildPatchedImgUrls(
											baseUrls,
											incomingVariant.keptImgs,
											{
												imgFiles: [], // Passed down globally from Multer interceptor
												newImgIndices: incomingVariant.newImgIndices,
											},
										)
									: undefined;
						} else {
							// New variant creation: Only assemble mapped new images
							variantImgUrls =
								incomingVariant.newImgIndices &&
								incomingVariant.newImgIndices.length > 0
									? await this.buildPatchedImgUrls([], [], {
											imgFiles,
											newImgIndices: incomingVariant.newImgIndices,
										})
									: [];
						}

						if (incomingVariant.variantId) {
							// UPDATE: It already exists in the database
							await tx.productVariant.update({
								where: { id: incomingVariant.variantId },
								data: {
									title: incomingVariant.title,
									price: incomingVariant.price,
									stock: incomingVariant.stock,
									sku: incomingVariant.sku,
									imgUrls: variantImgUrls,
								},
							});
						} else {
							// CREATE: Entirely new variant combination created via front-end additions
							const createdVariant = await tx.productVariant.create({
								data: {
									productId: id,
									title: incomingVariant.title,
									price: incomingVariant.price,
									stock: incomingVariant.stock,
									sku: incomingVariant.sku,
									imgUrls: variantImgUrls,
								},
							});

							// Attach its variant dimensions mappings
							for (const selection of incomingVariant.selections!) {
								// Fetch corresponding DB item references
								const dbOption = await tx.productOption.findFirst({
									where: { productId: id, name: selection.optionName },
								});
								const dbValue = await tx.productOptionValue.findFirst({
									where: {
										optionId: dbOption?.id,
										value: selection.optionValue,
									},
								});

								if (dbOption && dbValue) {
									await tx.variantSelection.create({
										data: {
											variantId: createdVariant.id,
											optionId: dbOption.id,
											optionValueId: dbValue.id,
										},
									});
								}
							}
						}
					}
				}

				return tx.product.update({
					where: { id },
					data: {
						name: translatedName,
						description: translatedDescription,
						shortDescription: translatedShortDescription,
						tags,
						imgUrls,
						categoryId,
					},

					...productWithVariantsReviewsUser,
				});
			},
			{ timeout: 30000 },
		);
	}

	async updateVariant(
		id: string,
		variantId: string,
		userId: string,
		params: UpdateProductVariantDto,
		imgFiles: Express.Multer.File[],
	): Promise<ProductWithVariantsReviewsUser | null> {
		const {
			title,
			price,
			compareAtPrice,
			stock,
			sku,
			keptImgs,
			newImgIndices,
		} = params;

		const existingProduct = await this.prisma.product.findUnique({
			where: { id },
		});

		if (!existingProduct) {
			throw new NotFoundException("Product not found");
		}

		if (existingProduct.userId !== userId) {
			throw new UnauthorizedException("Not allowed");
		}

		if (newImgIndices && imgFiles.length !== newImgIndices.length) {
			throw new BadRequestException(
				"newImgIndices length must match imgFiles length",
			);
		}

		const existingVariant = await this.prisma.productVariant.findUnique({
			where: {
				productId: id,
				id: variantId,
			},
		});

		if (!existingVariant) {
			throw new NotFoundException("Variant not found");
		}

		const imgUrls =
			keptImgs || newImgIndices
				? await this.buildPatchedImgUrls(existingVariant.imgUrls, keptImgs, {
						imgFiles,
						newImgIndices: newImgIndices,
					})
				: undefined;

		await this.prisma.productVariant.update({
			where: {
				id: variantId,
				productId: id,
			},
			data: {
				title,
				price,
				compareAtPrice,
				sku,
				stock,
				imgUrls,
			},
		});

		return this.prisma.product.findUnique({
			where: {
				id,
			},
			...productWithVariantsReviewsUser,
		});
	}

	async delete(id: string, userId: string) {
		const existingProduct = await this.prisma.product.findUnique({
			where: { id },
		});

		if (!existingProduct) {
			throw new NotFoundException("Product not found");
		}

		if (existingProduct.userId !== userId) {
			throw new UnauthorizedException("Not allowed");
		}

		return this.prisma.product.delete({ where: { id } });
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
