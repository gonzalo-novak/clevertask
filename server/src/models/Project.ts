import { Schema, model } from "mongoose";

const projectSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
	},
	{ timestamps: true }
);

export const Project = model("Project", projectSchema);
