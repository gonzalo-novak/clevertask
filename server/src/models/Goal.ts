import { Schema, model } from "mongoose";

const goalSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
		chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
	},
	{ timestamps: true }
);

export const Goal = model("Goal", goalSchema);
