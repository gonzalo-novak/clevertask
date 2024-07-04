import { Schema, model } from "mongoose";

const messageSchema = new Schema(
	{
		chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
		role: { type: String, enum: ["user", "model"], required: true },
		message: { type: String, required: true },
	},
	{ timestamps: true }
);

export const Message = model("Message", messageSchema);
