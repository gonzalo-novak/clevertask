import { Request, Response, NextFunction } from "express";
import { RegisterReqBody } from "../types";
import { sendErrorResponseObject } from "../../../utils/sendResponse";

export const validateRequiredUserFields = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const body: RegisterReqBody = req.body;
	const { name, lastName, email, password } = body;

	if (!name || !lastName || !email || !password) {
		return res.status(400).json(
			sendErrorResponseObject({
				message: "The request object does not meet the required criteria",
			})
		);
	}

	if (password.length < 8) {
		return res.status(400).json(
			sendErrorResponseObject({
				message:
					"The password is too short. Try to think about a long phrase you like",
			})
		);
	}

	next();
};
