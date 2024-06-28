import { logger } from "../../app";
import { User } from "../../models/User";
import { Express, Request, Response } from "express";
import { authVerify } from "../../middleware/authVerify";
import { getUserIdFromToken } from "../../utils/getUserIdFromToken";
import { Goal } from "../../models/Goal";
import {
	sendErrorResponseObject,
	sendSuccessfulResponseObject,
} from "../../utils/sendResponse";

const user = (app: Express) => {
	app.get(
		"/user/profile",
		[authVerify],
		async (req: Request, res: Response) => {
			try {
				const userId = getUserIdFromToken(req);

				const user = await User.findById(userId).select(
					"-_id -password -createdAt -updatedAt -__v"
				);

				return res.json(sendSuccessfulResponseObject({ user }));
			} catch (error) {
				logger.error("User profile:", error);
				return res.status(500).json(
					sendErrorResponseObject({
						message: "There was an error while getting the user info.",
					})
				);
			}
		}
	);

	app.get(
		"/user/overview",
		[authVerify],
		async (req: Request, res: Response) => {
			try {
				const userId = getUserIdFromToken(req);
				const goals = await Goal.find({ createdBy: userId });
				return res.json(
					sendSuccessfulResponseObject({
						overview: !goals.length ? null : goals,
					})
				);
			} catch (error) {
				logger.error("User overview:", error);
				return res.status(500).json(
					sendErrorResponseObject({
						message: "There was an error while getting the user's overview.",
					})
				);
			}
		}
	);
};

export { user };
