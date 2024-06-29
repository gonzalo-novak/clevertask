import { Schema, model } from "mongoose";

const chatHistorySchema = new Schema(
	{
		chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
		history: { type: String, required: true },
	},
	{ timestamps: true }
);

export const ChatHistory = model("ChatHistory", chatHistorySchema);
