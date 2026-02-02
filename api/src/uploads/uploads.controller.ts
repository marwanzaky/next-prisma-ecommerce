import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { Public } from "src/auth/auth.guard";
import { UploadsService } from "./uploads.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("uploads")
@Public()
export class UploadsController {
	constructor(private uploadsService: UploadsService) {}

	@Post()
	@ApiOperation({
		summary: "Upload file",
	})
	@UseInterceptors(FileInterceptor("file"))
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		if (!file) throw new Error("No file provided");

		const url = await this.uploadsService.uploadFile(file);
		return { url };
	}
}
