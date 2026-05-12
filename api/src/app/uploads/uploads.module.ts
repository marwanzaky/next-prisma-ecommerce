import { Module } from "@nestjs/common";

import { CloudinaryModule } from "@/services/cloudinary/cloudinary.module";

import { UploadsController } from "./uploads.controller";

@Module({
	imports: [CloudinaryModule],
	controllers: [UploadsController],
	providers: [],
})
export class UploadsModule {}
