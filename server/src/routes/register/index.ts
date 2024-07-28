import { Hono } from "hono";
import * as argon from "argon2";
import { User } from "../../models/User";
import { RegisterReqBody } from "./types";
import { createAuthToken } from "../../utils/createAuthToken";
import { validateRequiredUserFields } from "./middleware/validateFields";
import { validateEmailDuplication } from "./middleware/validateEmailDuplication";

const app = new Hono();

app.use(validateRequiredUserFields);
app.use(validateEmailDuplication);

app.post("/", async (c) => {
	const { password, name, lastName, email } =
		await c.req.json<RegisterReqBody>();

	const hash = await argon.hash(password);
	const user = new User({ name, lastName, email, password: hash });

	await user.save();
	const token = createAuthToken({ user: user._id });
	return c.json({ token });
});

export default app;
