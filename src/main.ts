import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import * as cors from "cors";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

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
		.build();

	SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, config));

	app.useGlobalPipes(new ValidationPipe());

	await app.listen(3000);
}
bootstrap();
