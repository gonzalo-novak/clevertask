import * as argon from "argon2";
import { Express, Request, Response } from "express";
import { logger } from "../../app";
import { User } from "../../models/User";
import { RegisterReqBody } from "./types";
import { createAuthToken } from "../../utils/createAuthToken";
import { validatePassword } from "./middleware/validatePassword";
import { validateRequiredUserFields } from "./middleware/validateFields";
import { validateEmailDuplication } from "./middleware/validateEmailDuplication";
import {
	sendErrorResponseObject,
	sendSuccessfulResponseObject,
} from "../../utils/sendResponse";

const register = (app: Express) => {
	app.post(
		"/user/register",
		[validateRequiredUserFields, validateEmailDuplication, validatePassword],
		async (req: Request, res: Response) => {
			const body: RegisterReqBody = req.body;
			const { password, name, lastName, email } = body;

			try {
				const hash = await argon.hash(password);
				const user = new User({ name, lastName, email, password: hash });
				await user.save();

				return res.status(201).json(
					sendSuccessfulResponseObject<{ token: string }>({
						token: createAuthToken({ user: user._id }),
					})
				);
			} catch (error) {
				logger.error("Register: ", error);
				return res.status(500).json(
					sendErrorResponseObject({
						message: "There was an error while creating the account.",
					})
				);
			}
		}
	);
};

export { register };
