import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getUserIdFromToken = (req: Request) => {
	const authToken = req.get("Authorization");

	const { user: userId } = jwt.decode(authToken!) as JwtPayload & {
		user: string;
	};

	return userId;
};
