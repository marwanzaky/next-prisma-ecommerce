import { Module } from "@nestjs/common";

import { PrismaService } from "@/prisma.service";

import { CategoriesService } from "./categories.service";

import { TranslationModule } from "../translation/translation.module";

@Module({
	imports: [TranslationModule],
	providers: [CategoriesService, PrismaService],
	exports: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
