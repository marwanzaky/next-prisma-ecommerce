import { Module } from "@nestjs/common";

import { PrismaService } from "@/prisma.service";

import { CartsController } from "./carts.controller";

@Module({
	controllers: [CartsController],
	providers: [PrismaService],
})
export class CartsModule {}
