import { logger } from "../../app";
import { Express, json, Request, Response } from "express";
import { authVerify } from "../../middleware/authVerify";
import {
	sendErrorResponseObject,
	sendSuccessfulResponseObject,
} from "../../utils/sendResponse";
import { RedisClientType } from "redis";
import { getUserIdFromToken } from "../../utils/getUserIdFromToken";
import { Chat } from "../../models/Chat";
import { Message } from "../../models/Message";
import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTIONS } from "./constants";

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
const generationConfig = {
	temperature: 0.5,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 8192,
	responseMimeType: "text/plain",
};

const chat = (app: Express, redis: RedisClientType) => {
	app.post(
		"/chat/:chatId/send",
		[authVerify],
		async (req: Request, res: Response) => {
			try {
				const chatId = req.params.chatId;
				const userId = getUserIdFromToken(req);
				const { message } = req.body;

				if (!chatId) {
					return res
						.status(400)
						.json(
							sendErrorResponseObject({ message: "Chat id is not present" })
						);
				}

				if (!message) {
					return res
						.status(400)
						.json(
							sendErrorResponseObject({ message: "Message is not present" })
						);
				}

				const currentChat = await Chat.findOne({
					createdBy: userId,
					_id: chatId,
				}).populate("createdBy", "name");

				if (!currentChat) throw new Error("Chat does not exist");

				const currentChatMessages = await Message.find({
					chatId: chatId,
				}).sort({ createdAt: 1 });

				let currentChatHistory: Content[] = [];

				if (await redis.exists(chatId)) {
					currentChatHistory = JSON.parse((await redis.get(chatId))!);
				} else {
					currentChatHistory = currentChatMessages.reduce(
						(acc, { role, message }) => {
							acc = [...acc, { role, parts: [{ text: message }] }];
							return acc;
						},
						[] as Content[]
					);
					await redis.set(chatId, JSON.stringify(currentChatHistory));
				}

				console.log(currentChatHistory);

				const _message = SYSTEM_INSTRUCTIONS.INIT.replaceAll(
					"[USER_STATEMENT]",
					message
				).replaceAll("[USER_NAME]", (currentChat as any).createdBy.name);

				const model = genAI.getGenerativeModel({
					model: "gemini-1.5-flash",
				});

				const chat = model.startChat({
					history: currentChatHistory,
					generationConfig,
				});
				const result = await chat.sendMessage(_message);
				await new Message({ chatId, message, role: "user" }).save();

				const response = result.response;
				const text = response.text();

				console.log(currentChatHistory);

				currentChatHistory = currentChatHistory.slice(0, -2);

				console.log(currentChatHistory);

				const cleanedResponse = text.replace(/```json|```|\n/g, "").trim();

				const jsonData: { nextStage: string; message: string } =
					JSON.parse(cleanedResponse);
				console.log(jsonData.nextStage);
				await new Message({
					chatId,
					message: jsonData.message,
					role: "model",
				}).save();

				await redis.set(chatId, JSON.stringify(currentChatHistory));

				return res.json(
					sendSuccessfulResponseObject({ text: jsonData.message })
				);
			} catch (error) {
				logger.error("Error while sending a new message: ", error);
				return res.status(500).json(
					sendErrorResponseObject({
						message: "There was an error while sending a message",
					})
				);
			}
		}
	);

	app.delete(
		"/chat/:chatId/delete",
		[authVerify],
		async (req: Request, res: Response) => {
			try {
				const _chatId = req.params.chatId;
				if (!_chatId) {
					return res
						.status(400)
						.json(
							sendErrorResponseObject({ message: "Chat id is not present" })
						);
				}
				const userId = getUserIdFromToken(req);
				const currentChat = await Chat.findOne({
					createdBy: userId,
					_id: _chatId,
				});

				if (!currentChat) throw new Error("Chat does not exist");

				const chatId = currentChat._id.toString();
				const keyExists = await redis.exists(chatId);

				if (keyExists !== 1) throw new Error("Key does not exist");

				await redis.del(chatId);
				await Chat.findByIdAndDelete(chatId);
				await Message.deleteMany({ chatId });

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

			await redis.set(chatId, "[]");
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
