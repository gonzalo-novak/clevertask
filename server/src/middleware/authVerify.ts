import { Response, Request, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

const authVerify = (req: Request, res: Response, next: NextFunction) => {
	const authToken = req.get("Authorization");

	if (!authToken) {
		return res.status(401).json({ message: "You must be logged in" });
	}

	try {
		if (authToken) {
			jwt.verify(authToken, process.env.JWT_KEY as Secret);
			next();
		}
	} catch (error) {
		return res.status(401).json({
			message: "your token has been expired, log in again.",
		});
	}
};

export { authVerify };
