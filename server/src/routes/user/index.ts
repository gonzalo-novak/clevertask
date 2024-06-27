import { logger } from "../../app";
import { User } from "../../models/User";
import { Express, Request, Response } from "express";
import { authVerify } from "../../middleware/authVerify";
import { getUserIdFromToken } from "../../utils/getUserIdFromToken";

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
};

export { user };
