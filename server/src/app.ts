import cors from 'cors';
import express from 'express';
import { example } from './routes/example';
import { pipeRoutes } from './utils/pipeRoutes';

const server = async () => {
	const app = express();
	const port = process.env.PORT;

	if(process.env.NODE_ENV === 'development') {
		app.use(cors({
			origin: '*',
			allowedHeaders: ['Content-Type', 'Authorization']
		}));
	}
	app.use(express.json({}));

	pipeRoutes(
		example,
	)(app);

	app.listen(port, () => {
		console.log(`App listening at http://localhost:${port}`);
	});
};

server();
