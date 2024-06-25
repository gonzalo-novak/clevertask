import { NextFunction, Request, Response } from "express";
import { User } from "../../../models/User";
import { RegisterReqBody } from "../types";

export const isEmailDuplicated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const body: RegisterReqBody = req.body;
	const { email } = body;
	const emailDuplicated = await User.findOne({ email });

	if (emailDuplicated) {
		return res.status(500).json({
			message: "There was an error while creating the account. Try it later.",
		});
	}

	next();
};
