import { Schema, model } from "mongoose";

const goalSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		dueDate: { type: Date, required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
	},
	{ timestamps: true }
);

export const Goal = model("Goal", goalSchema);
