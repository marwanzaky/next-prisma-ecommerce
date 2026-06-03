import { Injectable } from "@nestjs/common";

import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
	constructor() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
	}

	async uploadFile(file: Express.Multer.File): Promise<string | undefined> {
		return new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{ folder: "products" },
				(error, result) => {
					if (error) return reject(error);
					resolve(result?.secure_url);
				},
			);

			const readable = new Readable();
			readable._read = () => {};
			readable.push(file.buffer);
			readable.push(null);
			readable.pipe(stream);
		});
	}

	async deleteFile(url: string): Promise<void> {
		try {
			// Extract the public ID from the Cloudinary URL
			// Example URL: https://res.cloudinary.com/demo/image/upload/v1234567/folder/sample.jpg
			// Extracts: "folder/sample"
			const splits = url.split("/");
			const uploadIndex = splits.findIndex((path) => path === "upload");
			// Grabs everything after 'upload/v1234567/' and removes extension
			const publicId = splits
				.slice(uploadIndex + 2)
				.join("/")
				.split(".")[0];

			return await cloudinary.uploader.destroy(publicId);
		} catch (error) {
			console.error(`Failed to delete image from Cloudinary: ${url}`, error);
		}
	}
}
