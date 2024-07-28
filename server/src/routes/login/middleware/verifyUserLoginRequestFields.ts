import { HTTPException } from "hono/http-exception";
import { UserLoginReqBody } from "../types";
import { createMiddleware } from "hono/factory";

export const verifyUserLoginRequestFields = createMiddleware(
	async (c, next) => {
		const { email, password } = await c.req.json<UserLoginReqBody>();

		if (!email || !password) {
			throw new HTTPException(400, {
				message: "The request object does not meet the required criteria",
			});
		}

		await next();
	}
);
