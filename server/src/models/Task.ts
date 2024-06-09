import { Schema, model } from "mongoose";

const taskSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
		goal: { type: Schema.Types.ObjectId, ref: "Goal", required: true },
	},
	{ timestamps: true }
);

export const Task = model("Task", taskSchema);
