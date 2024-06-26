import * as argon2 from "argon2";
import { logger } from "../../app";
import { User } from "../../models/User";
import { UserLoginReqBody } from "./types";
import { Express, Request, Response } from "express";
import { createAuthToken } from "../../utils/createAuthToken";
import { verifyUserExistence } from "./middleware/verifyUserExistence";
import { verifyUserLoginRequestFields } from "./middleware/verifyUserLoginRequestFields";
import {
	sendErrorResponseObject,
	sendSuccessfulResponseObject,
} from "../../utils/sendResponse";

const login = (app: Express) => {
	app.post(
		"/user/login",
		[verifyUserLoginRequestFields, verifyUserExistence],
		async (req: Request, res: Response) => {
			const { email, password } = req.body as UserLoginReqBody;
			const user = await User.findOne({ email: { $eq: email } });

			try {
				const { password: userPassword } = user!.toObject();
				const isPasswordValid = await argon2.verify(userPassword, password);

				if (!isPasswordValid) {
					return res.status(401).json(
						sendErrorResponseObject({
							message: "The credentials are not correct. Try it again.",
						})
					);
				}

				const token = createAuthToken({ user: user!._id });
				return res.json(
					sendSuccessfulResponseObject<{ token: string }>({ token })
				);
			} catch (error) {
				logger.error("Login: ", error);
				return res.status(500).json(
					sendErrorResponseObject({
						message: "There was an error while processing the request",
					})
				);
			}
		}
	);
};

export { login };
