import jwt from "jsonwebtoken";

const createAuthToken = (payload: any) =>
	jwt.sign(payload, process.env.JWT_KEY as jwt.Secret, {
		expiresIn: "24h",
	});

export { createAuthToken };
