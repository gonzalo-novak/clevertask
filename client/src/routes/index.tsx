import { paths } from "./paths";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
	{
		path: paths.ROOT,
		children: [
			{
				path: paths.REGISTER,
				Component: Register,
			},
			{
				path: paths.LOGIN,
				Component: Login,
			},
		],
	},
]);
