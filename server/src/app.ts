import cors from "cors";
import helmet from "helmet";
import express from "express";
import * as log4js from "log4js";
import { register } from "./routes/register";
import { connectDatabase } from "./config/db";
import { pipeRoutes } from "./utils/pipeRoutes";
import { login } from "./routes/login";
import { user } from "./routes/user";

export const logger = log4js.getLogger("clevertask-log");
logger.level = "debug";

const server = async () => {
	await connectDatabase();

	const app = express();
	const port = process.env.PORT;

	if (process.env.NODE_ENV === "development") {
		app.use(
			cors({
				origin: "*",
				allowedHeaders: ["Content-Type", "Authorization"],
			})
		);
	}
	app.use(helmet());
	app.use(express.json({}));

	pipeRoutes(register, login, user)(app);

	app.listen(port, () => {
		console.log(`App listening at http://localhost:${port}`);
	});
};

server();
