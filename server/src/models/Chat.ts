import { Schema, model } from "mongoose";

const chatSchema = new Schema(
	{
		title: String,
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true }
);

export const Chat = model("Chat", chatSchema);
