import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { json } from "express";
import helmet from "helmet";

import { AppModule } from "@/app/app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Middlewares
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.enableCors();
	app.use(helmet());
	app.use(json({ limit: "4mb" }));

	// Swagger config
	const config = new DocumentBuilder()
		.setTitle("SWAGGER API")
		.setVersion("1.0")
		.addBearerAuth(
			{
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
			"Authorization",
		)
		.build();
	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("api", app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
