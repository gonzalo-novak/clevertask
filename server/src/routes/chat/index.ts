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
import { Message } from "../../models/Message";
import {
	Content,
	FunctionDeclarationSchemaType,
	GoogleGenerativeAI,
} from "@google/generative-ai";
import { MAIN_INSTRUCTION, SYSTEM_INSTRUCTIONS } from "./constants";
import { model } from "mongoose";

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

const generationConfig = {
	temperature: 0.25,
	topP: 0.9,
	topK: 40,
	maxOutputTokens: 45000,
	responseMimeType: "application/json",
};

let currentAction: string = "INIT";

const chat = (app: Express, redis: RedisClientType) => {
	app.get("/chat/:chatId/create_resources", authVerify, async (req, res) => {
		try {
			const chatId = req.params.chatId;
			const userId = getUserIdFromToken(req);

			if (!chatId) return res.sendStatus(401);

			const chat = await Chat.find({ createdBy: userId, _id: chatId });

			if (!chat) return res.sendStatus(401);

			const messages = await Message.find({
				chatId: chatId,
			}).sort({ createdAt: 1 });

			enum extractableActions {
				"PURPOSE_DEFINITION" = "PURPOSE_DEFINITION",
				"GOAL_TASK_DEFINITION" = "GOAL_TASK_DEFINITION",
				"PURPOSE_GOAL_TASK_DEFINITION" = "PURPOSE_GOAL_TASK_DEFINITION",
				"PURPOSE_GOAL_LIST_DEFINITION" = "PURPOSE_GOAL_LIST_DEFINITION",
			}

			const modelMessages = messages.filter(({ role }) => role === "model");

			const purposeDefinition = modelMessages.filter(({ message }) =>
				message.includes(extractableActions.PURPOSE_DEFINITION)
			);

			const purposeGoalListDefinition = modelMessages.filter(({ message }) =>
				message.includes(extractableActions.PURPOSE_GOAL_LIST_DEFINITION)
			);

			const goalTaskDefinition = modelMessages.filter(
				({ message }) =>
					message.includes(extractableActions.GOAL_TASK_DEFINITION) ||
					message.includes(extractableActions.PURPOSE_GOAL_TASK_DEFINITION)
			);

			const model = genAI.getGenerativeModel({
				model: "gemini-1.5-pro",
				generationConfig,
			});

			const { response } = await model.generateContent(`
				Please, help me create a JSON based on a conversation that aims to create a plan for a goal. You don't have to summarize anything, just copy and paste the tasks for each section that I'll define below this message, however, try not to duplicate content. The tasks are already confirmed by the user, it's a matter of moving these tasks to the JSON object so I can store it in the database. First, we defined the main purpose of the user's goal, this is the answers the AI outputted:

				PURPOSE_DEFINITION: ${purposeDefinition}

				Also, we defined the goal list for that purpose:

				PURPOSE_GOAL_LIST_DEFINITION: ${purposeGoalListDefinition}

				Last but not least, we defined the task list for these goal list:

				GOAL_TASK_DEFINITION: ${goalTaskDefinition}

				Your task is output the following JSON schema based on the info above:

				{
					title: the purpose's title (from the PURPOSE_DEFINITION conversation),
					description: the purposes description (from the PURPOSE_DEFINITION conversation),
					goals: {
						title: the goal title (from the PURPOSE_GOAL_LIST_DEFINITION conversation),
						description: the goal description (from the PURPOSE_GOAL_LIST_DEFINITION conversation),
						tasks: {
							title: the goal task title (from the GOAL_TASK_DEFINITION conversation),
							description: the goal task description (from the GOAL_TASK_DEFINITION conversation)
						}[]
					}[]
				}
			`);

			const text = response.text();
			console.log(response.usageMetadata);

			return res.json({
				text,
			});
		} catch (error) {}
	});

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

				const model = genAI.getGenerativeModel({
					model: "gemini-1.5-pro",
					systemInstruction: `${MAIN_INSTRUCTION}${SYSTEM_INSTRUCTIONS.INIT}`
						.replaceAll("[USER_NAME]", (currentChat as any).createdBy.name)
						.replaceAll("{action}", currentAction),
				});

				const chat = model.startChat({
					history: currentChatHistory,
					generationConfig,
				});

				const result = await chat.sendMessage(message);
				await new Message({ chatId, message, role: "user" }).save();

				const response = result.response;
				const text = response.text();

				const jsonData: { action: string; message: string } = JSON.parse(text);

				if (jsonData.message && jsonData.action) {
					console.log(jsonData);

					await new Message({
						chatId,
						message: JSON.stringify(jsonData),
						role: "model",
					}).save();

					await redis.set(chatId, JSON.stringify(currentChatHistory));

					currentAction = jsonData.action;
					console.log(currentAction);

					return res.json(
						sendSuccessfulResponseObject({ text: jsonData.message })
					);
				}

				return new Error(
					"The AI returned a different answer than the expected one" + text
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
