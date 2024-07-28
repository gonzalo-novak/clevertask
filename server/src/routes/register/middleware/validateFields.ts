import { createMiddleware } from "hono/factory";
import { RegisterReqBody } from "../types";
import { HTTPException } from "hono/http-exception";

export const validateRequiredUserFields = createMiddleware(async (c, next) => {
	const { name, lastName, email, password } =
		await c.req.json<RegisterReqBody>();

	if (!name || !lastName || !email || !password) {
		throw new HTTPException(400, {
			message: "The request object does not meet the required criteria",
		});
	}

	if (password.length < 8) {
		throw new HTTPException(400, {
			message:
				"The password is too short. Try to think about a long phrase you like",
		});
	}

	await next();
});
