import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import jwt, { Secret } from "jsonwebtoken";

export const authVerify = createMiddleware(async (c, next) => {
	const authToken = c.req.header("Authorization");

	if (!authToken) {
		throw new HTTPException(401);
	}

	try {
		if (authToken) {
			jwt.verify(authToken, process.env.JWT_KEY as Secret);
			await next();
		}
	} catch (error) {
		throw new HTTPException(401, { message: "Token expired. Log in again" });
	}
});
