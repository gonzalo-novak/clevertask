import { Request, Response, NextFunction } from "express";
import { RegisterReqBody } from "../types";

export const validatePassword = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const body: RegisterReqBody = req.body;
	const { password } = body;

	if (password.length < 8) {
		return res.status(400).json({
			message:
				"The password is too short. Try to think about a long phrase you like",
		});
	}

	next();
};
