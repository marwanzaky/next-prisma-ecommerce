import { Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { CloudinaryModule } from "@modules/cloudinary/cloudinary.module";

@Module({
	imports: [CloudinaryModule],
	controllers: [UploadsController],
	providers: [],
})
export class UploadsModule {}
