import { Schema, model } from "mongoose";

const chatSchema = new Schema(
	{
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true }
);

export const Chat = model("Chat", chatSchema);
