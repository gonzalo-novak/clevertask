import { logger } from "../../app";
import { Express, Request, Response } from "express";
import { authVerify } from "../../middleware/authVerify";
import {
	sendErrorResponseObject,
	sendSuccessfulResponseObject,
} from "../../utils/sendResponse";
import { RedisClientType } from "redis";
import { getUserIdFromToken } from "../../utils/getUserIdFromToken";
import { Chat } from "../../models/Chat";

const chat = (app: Express, redis: RedisClientType) => {
	app.delete(
		"/chat/:chatId",
		[authVerify],
		async (req: Request, res: Response) => {
			try {
				const userId = getUserIdFromToken(req);
				const currentChat = await Chat.findOne({ createdBy: userId });

				if (!currentChat) throw new Error("Chat does not exist");

				const chatId = currentChat._id.toString();
				const keyExists = await redis.exists(chatId);

				if (keyExists !== 1) throw new Error("Key does not exist");

				await redis.del(chatId);
				await Chat.findByIdAndDelete(chatId);

				return res.sendStatus(204);
			} catch (error) {
				logger.error("Error while deleting the chat: ", error);
				return res.status(500).json(
					sendErrorResponseObject({
						message: "There was an error while deleting the chat",
					})
				);
			}
		}
	);

	app.post("/chat/new", [authVerify], async (req: Request, res: Response) => {
		try {
			const userId = getUserIdFromToken(req);
			const chat = new Chat({ createdBy: userId });
			const createdChat = await chat.save();
			const chatId = createdChat._id.toString();

			await redis.set(chatId, "");
			return res.json(sendSuccessfulResponseObject({ chatId }));
		} catch (error) {
			logger.error("New chat error: ", error);
			return res.status(500).json(
				sendErrorResponseObject({
					message: "There was an error while starting a new chat",
				})
			);
		}
	});
};

export { chat };
