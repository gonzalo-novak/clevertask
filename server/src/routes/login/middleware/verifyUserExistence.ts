import { NextFunction, Request, Response } from "express";
import { UserLoginReqBody } from "../types";
import { User } from "../../../models/User";

export const verifyUserExistence = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const body: UserLoginReqBody = req.body;
	const { email } = body;
	const user = await User.findOne({ email: { $eq: email } });

	if (!user) {
		return res.status(500).json({
			message: "There was an error to process the request",
		});
	}
	next();
};
