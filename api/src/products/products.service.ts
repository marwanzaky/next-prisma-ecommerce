import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import mongoose, { Model } from "mongoose";

import {
	CreateProductEntity,
	UpdateProductEntity,
} from "@interfaces/product.interface";
import { Product } from "./entities/product.entity";
import { Review } from "@reviews/entities/review.entity";
import { CategoriesService } from "@modules/categories/categories.service";
import {
	ProductEntity,
	ProductWithReviewsEntity,
	Rating,
	RatingDistribution,
} from "@shared/product.types";

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name) private productModel: Model<Product>,
		@InjectModel(Review.name) private reviewModel: Model<Review>,
		private categoriesService: CategoriesService,
	) {}

	async create(
		user: string,
		{
			name,
			price,
			priceCompare,
			imgUrls,
			description,
			tags,
			stock,
			category,
		}: CreateProductEntity,
	): Promise<Product> {
		const product = await this.productModel.create({
			user,
			name,
			price,
			priceCompare,
			imgUrls,
			description,
			tags: tags || [],
			stock,
			category,
		});

		return product.save();
	}

	/**
	 * Returns ProductEntity document
	 */
	async find(options?: {
		sort?: {
			property?: keyof ProductEntity;
			order?: "asc" | "desc";
		};
		query?: {
			ids?: string[];
			excludeIds?: string[];
			name?: string;
			user?: string;
			minPrice?: number;
			maxPrice?: number;
			featured?: boolean;
			isHero?: boolean;
			limit?: number;
			avgRatings?: number;
			category?: string;
		};
	}): Promise<Product[]> {
		const { sort = {}, query = {} } = options || {};

		const sortOptions: Record<string, 1 | -1> = {};

		if (sort.property && sort.order) {
			sortOptions[sort.property] = sort.order === "asc" ? 1 : -1;
		}

		const filter: Record<string, any> = {};

		if (query.user) {
			filter.user = new mongoose.Types.ObjectId(query.user);
		}

		if (query.name) {
			filter.name = { $regex: new RegExp(query.name, "i") };
		}

		if (query.category) {
			const categories =
				await this.categoriesService.getAllDescendantCategoryIds(
					query.category,
				);

			filter.category = { $in: categories };
		}

		if (query.minPrice !== undefined || query.maxPrice !== undefined) {
			filter.price = {};

			if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
			if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
		}

		if (query.featured !== undefined) {
			filter.featured = query.featured;
		}

		if (query.isHero !== undefined) {
			filter.isHero = query.isHero;
		}

		if (query.ids && query.ids.length > 0) {
			filter._id = {
				$in: query.ids.map((id) => new mongoose.Types.ObjectId(id)),
			};
		}

		if (query.excludeIds && query.excludeIds.length > 0) {
			filter._id = {
				...filter._id,
				$nin: query.excludeIds.map((id) => new mongoose.Types.ObjectId(id)),
			};
		}

		if (query.avgRatings !== undefined) {
			filter.avgRatings = { $gte: query.avgRatings };
		}

		const filteredProducts = this.productModel.find(filter).sort(sortOptions);

		if (query.limit !== undefined && query.limit > 0) {
			filteredProducts.limit(query.limit);
		}

		return filteredProducts;
	}

	async findById(id: string): Promise<ProductWithReviewsEntity> {
		const product = await this.productModel
			.findById(id)
			.populate("reviews")
			.populate({
				path: "user",
				select: "_id name photoUrl updatedAt createdAt",
			});

		if (!product) {
			throw new NotFoundException("Could not find the product");
		}

		return product as unknown as ProductWithReviewsEntity;
	}

	findByIdAndUpdate(
		id: string,
		updateProductDto: UpdateProductEntity,
	): Promise<Product | null> {
		return this.productModel.findByIdAndUpdate(id, updateProductDto, {
			new: true,
			runValidators: true,
		});
	}

	async findByIdAndDelete(id: string): Promise<Product | null> {
		await this.reviewModel.deleteMany({
			product: new mongoose.Types.ObjectId(id),
		});
		return this.productModel.findByIdAndDelete(id);
	}

	async calcAvgRatings(productId: string) {
		const stats: { _id: string; numRating: number; avgRating: number }[] =
			await this.reviewModel.aggregate([
				{
					$match: {
						product: new mongoose.Types.ObjectId(productId),
					},
				},
				{
					$group: {
						_id: "$product",
						numRating: { $sum: 1 },
						avgRating: { $avg: "$rating" },
					},
				},
			]);

		await this.productModel.findByIdAndUpdate(productId, {
			numReviews: stats.length > 0 ? stats[0].numRating : 0,
			avgRatings: stats.length > 0 ? stats[0].avgRating : 0,
		});
	}

	async calcRatingDistribution(productId: string) {
		const distribution: { _id: Rating; count: number }[] =
			await this.reviewModel.aggregate([
				{
					$match: {
						product: new mongoose.Types.ObjectId(productId),
					},
				},
				{
					$group: {
						_id: { $round: ["$rating", 0] },
						count: { $sum: 1 },
					},
				},
			]);

		const ratingDistribution: RatingDistribution = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
		};

		distribution.forEach((item) => {
			ratingDistribution[item._id] = item.count;
		});

		await this.productModel.findByIdAndUpdate(productId, {
			ratingDistribution,
		});
	}
}
