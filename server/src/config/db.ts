import mongoose from "mongoose";

const connectDatabase = async () =>
	await mongoose.connect(process.env.MONGO_URL!);

export { connectDatabase };
