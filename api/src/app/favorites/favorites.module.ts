import { Module } from "@nestjs/common";

import { PrismaService } from "@/prisma.service";

import { FavoritesController } from "./favorites.controller";

@Module({
	controllers: [FavoritesController],
	providers: [PrismaService],
})
export class FavoritesModule {}
