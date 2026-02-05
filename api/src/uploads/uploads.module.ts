import { Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { CloudinaryModule } from "src/_modules/cloudinary/uploads.module";

@Module({
	imports: [CloudinaryModule],
	controllers: [UploadsController],
	providers: [],
})
export class UploadsModule {}
