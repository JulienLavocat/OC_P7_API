import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cors from "cors";
import { Response } from "express";
import helmet from "helmet";
import { join } from "path";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.use(helmet());
	app.use(
		cors({
			origin: "*",
		}),
	);

	const config = new DocumentBuilder()
		.setTitle("Groupomania social network")
		.setDescription("Groupomania social network API documentation")
		.setVersion("1.0.0")
		.addBearerAuth()
		.build();

	SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, config));

	app.useGlobalPipes(new ValidationPipe());

	app.useStaticAssets(join(__dirname, "..", "images"), {
		prefix: "/images/",
		setHeaders: (res: Response) => {
			res.setHeader("Cross-Origin-Resource-Policy", "same-site");
		},
	});

	await app.listen(3000);
}
bootstrap();
