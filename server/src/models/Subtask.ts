import { Schema, model } from "mongoose";

const subtaskSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
		chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
	},
	{ timestamps: true }
);

export const Subtask = model("Subtask", subtaskSchema);
