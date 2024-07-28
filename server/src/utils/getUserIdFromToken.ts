import jwt, { JwtPayload } from "jsonwebtoken";

export const getUserIdFromToken = (authToken: string) => {
	const { user: userId } = jwt.decode(authToken) as JwtPayload & {
		user: string;
	};

	return userId;
};
