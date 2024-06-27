import { logger } from "../../app";
import { Goal } from "../../models/Goal";
import { Express, Request, Response } from "express";
import { authVerify } from "../../middleware/authVerify";
import { getUserIdFromToken } from "../../utils/getUserIdFromToken";

const goal = (app: Express) => {
	app.get("/goal/all", [authVerify], async (req: Request, res: Response) => {
		try {
			const userId = getUserIdFromToken(req);
			const goalCount = await Goal.countDocuments({ createdBy: userId });
			if (!goalCount) {
				return res.sendStatus(204);
			}

			const goals = await Goal.find({ createdBy: userId });
			return res.json({ data: { goals } });
		} catch (error) {
			logger.error("Getting all goals error:", error);
			return res.status(500).json({
				message: "There was an error while getting the user's goals.",
			});
		}
	});
};

export { goal };
