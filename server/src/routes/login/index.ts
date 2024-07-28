import { Hono } from "hono";
import * as argon2 from "argon2";
import { User } from "../../models/User";
import { UserLoginReqBody } from "./types";
import { HTTPException } from "hono/http-exception";
import { createAuthToken } from "../../utils/createAuthToken";
import { verifyUserLoginRequestFields } from "./middleware/verifyUserLoginRequestFields";

const app = new Hono();

app.use(verifyUserLoginRequestFields);
app.post("/", async (c) => {
	const { email, password } = await c.req.json<UserLoginReqBody>();
	const user = await User.findOne({ email: { $eq: email } });

	const throwInvalidCredentialsError = () => {
		throw new HTTPException(401, {
			message: "The credentials are not correct. Try it again.",
		});
	};

	if (!user) {
		throwInvalidCredentialsError();
	}

	const { password: userPassword, _id } = user!.toObject();
	const isPasswordValid = await argon2.verify(userPassword, password);

	if (!isPasswordValid) {
		throwInvalidCredentialsError();
	}

	const token = createAuthToken({ user: _id });
	return c.json({ token });
});

export default app;
