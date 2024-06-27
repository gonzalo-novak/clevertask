import { logger } from "../../app";
import { User } from "../../models/User";
import { Express, Request, Response } from "express";
import { authVerify } from "../../middleware/authVerify";
import { getUserIdFromToken } from "../../utils/getUserIdFromToken";
import { Goal } from "../../models/Goal";

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
				return res.json({ data: { user } });
			} catch (error) {
				logger.error("User profile endpoint:", error);
				return res.status(500).json({
					message: "There was an error while getting the user info.",
				});
			}
		}
	);

	app.get(
		"/user/overview",
		[authVerify],
		async (req: Request, res: Response) => {
			try {
				const userId = getUserIdFromToken(req);
				const goalCount = await Goal.countDocuments({ createdBy: userId });

				if (!goalCount) {
					return res.sendStatus(204);
				}

				const goals = await Goal.find({ createdBy: userId });
				return res.json({ data: { goals } });
			} catch (error) {
				logger.error("User overview:", error);
				return res.status(500).json({
					message: "There was an error while getting the user's overview.",
				});
			}
		}
	);
};

export { user };
