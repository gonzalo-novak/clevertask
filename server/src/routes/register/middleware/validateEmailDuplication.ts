import { RegisterReqBody } from "../types";
import { User } from "../../../models/User";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const validateEmailDuplication = createMiddleware(async (c, next) => {
	const { email } = await c.req.json<RegisterReqBody>();
	const emailDuplicated = await User.findOne({ email: { $eq: email } });

	if (emailDuplicated) {
		throw new HTTPException(500, {
			message: "There was an error while creating the account. Try it later.",
		});
	}

	await next();
});
