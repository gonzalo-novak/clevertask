import { Response, Request, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

const authVerify = (req: Request, res: Response, next: NextFunction) => {
	const authToken = req.get("Authorization");

	if (!authToken) {
		return res.sendStatus(401);
	}

	try {
		if (authToken) {
			jwt.verify(authToken, process.env.JWT_KEY as Secret);
			next();
		}
	} catch (error) {
		return res.sendStatus(401);
	}
};

export { authVerify };
