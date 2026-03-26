import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	Req,
	UseInterceptors,
	UploadedFiles,
	NotFoundException,
} from "@nestjs/common";

import { ProductsService } from "./products.service";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { GetAllProductsDto } from "./dto/get-all-products.dto";
import { Public } from "@auth/auth.guard";
import { IRequest } from "@interfaces/request.interface";
import { ApiBearerAuth, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "@modules/cloudinary/cloudinary.service";
import { UpdateProduct } from "@interfaces/product.interface";
import { Types } from "mongoose";

@Controller("products")
@ApiBearerAuth("Authorization")
export class ProductsController {
	constructor(
		private readonly productsService: ProductsService,
		private readonly cloudinaryService: CloudinaryService,
	) {}

	@Get()
	@Public()
	@ApiOperation({
		summary: "Get all products",
	})
	async find(@Query() dto: GetAllProductsDto) {
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
			category,
		} = dto;

		return this.productsService.find({
			sort: {
				property: sortProperty,
				order: sortOrder,
			},
			query: {
				name,
				excludeIds,
				minPrice,
				maxPrice,
				featured,
				limit,
				avgRatings,
				category,
			},
		});
	}

	@Post()
	@ApiOperation({
		summary: "Create a new product",
	})
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FilesInterceptor("imgFiles", 10))
	async create(
		@Req() req: IRequest,
		@Body() createProductDto: CreateProductDto,
		@UploadedFiles() imgFiles: Express.Multer.File[],
	) {
		const imgUrls = await Promise.all(
			imgFiles.map((file) => this.cloudinaryService.uploadFile(file)),
		);

		return this.productsService.create(req.user.id, {
			...createProductDto,
			imgUrls: imgUrls.filter((el) => el !== undefined),
		});
	}

	@Get(":id")
	@Public()
	@ApiOperation({
		summary: "Get a single product by id",
	})
	async findById(@Param("id") id: string) {
		return this.productsService.findById(id);
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Update a product",
	})
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FilesInterceptor("newImgs", 10))
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateProductDto,
		@UploadedFiles() newImgs?: Express.Multer.File[],
	) {
		const { newImgsIndex } = dto;

		const keptImgsIndex = Array.isArray(dto.keptImgsIndex)
			? dto.keptImgsIndex.filter((el) => el !== undefined)
			: [dto.keptImgsIndex].filter((el) => el !== undefined);

		const keptImgsUrl = Array.isArray(dto.keptImgsUrl)
			? dto.keptImgsUrl.filter((el) => el !== undefined)
			: [dto.keptImgsUrl].filter((el) => el !== undefined);

		const product = await this.productsService.findById(id);

		if (!product) {
			throw new NotFoundException("Product not found");
		}

		const finalImgUrls: string[] = [];

		if (keptImgsUrl && keptImgsIndex) {
			keptImgsUrl.forEach((url, i) => {
				finalImgUrls[keptImgsIndex[i]] = url;
			});
		}

		let newImgsIndexArray = Array.isArray(newImgsIndex)
			? newImgsIndex.filter((el) => el !== undefined)
			: [newImgsIndex].filter((el) => el !== undefined);

		if (newImgs && newImgsIndexArray) {
			for (let i = 0; i < newImgsIndexArray.length; i++) {
				const newImgUrl = await this.cloudinaryService.uploadFile(newImgs[i]);

				if (newImgUrl) {
					finalImgUrls[newImgsIndexArray[i]] = newImgUrl;
				}
			}
		}

		const updatedProduct: UpdateProduct = {};

		if (dto.name !== undefined) {
			updatedProduct.name = dto.name;
		}
		if (dto.description !== undefined) {
			updatedProduct.description = dto.description;
		}
		if (dto.price !== undefined) {
			updatedProduct.price = dto.price;
		}
		if (dto.priceCompare !== undefined) {
			updatedProduct.priceCompare = dto.priceCompare;
		}
		if (dto.tags !== undefined) {
			updatedProduct.tags = dto.tags;
		}
		if (dto.category !== undefined) {
			updatedProduct.category = new Types.ObjectId(dto.category) as any;
		}
		if (finalImgUrls !== undefined) {
			updatedProduct.imgUrls = finalImgUrls.filter((el) => el !== undefined);
		}

		return this.productsService.findByIdAndUpdate(id, updatedProduct);
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Delete a product",
	})
	async removeProduct(@Param("id") id: string) {
		return this.productsService.findByIdAndDelete(id);
	}
}
