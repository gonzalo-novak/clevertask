import { NextFunction, Request, Response } from "express";
import { UserLoginReqBody } from "../types";
import { sendErrorResponseObject } from "../../../utils/sendResponse";

export const verifyUserLoginRequestFields = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const body: UserLoginReqBody = req.body;
	const { email, password } = body;

	if (!email || !password) {
		return res.status(400).json(
			sendErrorResponseObject({
				message: "The request object does not meet the required criteria",
			})
		);
	}
	next();
};
