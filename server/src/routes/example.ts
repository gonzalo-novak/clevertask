import { Express } from 'express';

export const example = (app: Express) => {
	app.get('/hello', (_, res) => {
		return res.json({ message: "Hello World!" });
	});
}
