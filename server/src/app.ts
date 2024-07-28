import { Hono } from "hono";
import { logger } from "hono/logger";
import loginRoute from "./routes/login";
import registerRoute from "./routes/register";
import { connectDatabase } from "./config/db";
import { HTTPException } from "hono/http-exception";

await connectDatabase();
const app = new Hono();

app.use(logger());

app.use(async (c, next) => {
	await next();
	const data = { data: await c.res.json() };
	c.res = undefined;
	c.res = c.json(data);
});

app.onError((error, c) => {
	console.log(error);
	return c.json(
		{ error: { message: error.message } },
		error instanceof HTTPException ? error.status : 500
	);
});

// Routes setup
app.route("/user/login", loginRoute);
app.route("/user/register", registerRoute);

export default {
	port: process.env.PORT,
	fetch: app.fetch,
};
