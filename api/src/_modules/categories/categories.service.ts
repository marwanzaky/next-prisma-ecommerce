import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import mongoose, { Model } from "mongoose";
import {
	ICategory,
	ICreateCategory,
	IUpdateCategory,
} from "src/_interfaces/category.interface";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoriesService {
	constructor(
		@InjectModel(Category.name)
		private categoryModel: Model<Category>,
	) {}

	async create(params: ICreateCategory): Promise<Category> {
		const { name, parent, slug, sortOrder } = params;

		const category = await this.categoryModel.create({
			name,
			parent,
			slug,
			sortOrder,
		});

		return category.save();
	}

	async find(filter?: Partial<ICategory>): Promise<Category[]> {
		return this.categoryModel.find(filter ? filter : {});
	}

	async findOne(filter?: Partial<ICategory>): Promise<Category | null> {
		return this.categoryModel.findOne(filter);
	}

	async findPublic(filter?: Partial<ICategory>): Promise<Category[]> {
		return this.categoryModel
			.find(filter ? filter : {})
			.select("_id name slug parent");
	}

	async getPublicCategoryTree() {
		const categories = await this.categoryModel
			.find({ isActive: true })
			.select("_id name slug parent")
			.lean();

		const categoryMap = new Map<
			string,
			Pick<ICategory, "_id" | "name" | "slug"> & {
				children: any[];
			}
		>();

		categories.forEach((cat) => {
			categoryMap.set(cat._id.toString(), {
				_id: cat._id.toString(),
				name: cat.name,
				slug: cat.slug,
				children: [],
			});
		});

		const tree: any[] = [];

		categories.forEach((cat) => {
			if (cat.parent) {
				const parentId = cat.parent.toString();
				const parent = categoryMap.get(parentId);

				if (parent) {
					parent.children.push(categoryMap.get(cat._id.toString()));
				}
			} else {
				tree.push(categoryMap.get(cat._id.toString()));
			}
		});

		return tree;
	}

	findOneAndUpdate(
		id: string,
		update: IUpdateCategory,
	): Promise<Category | null> {
		return this.categoryModel.findOneAndUpdate(
			{
				_id: new mongoose.Types.ObjectId(id),
			},
			update,
		);
	}
}
