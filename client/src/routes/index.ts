import { paths } from "./paths";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Overview } from "../pages/Overview";
import { LOCAL_STORAGE_CLEVERTASK_ITEM } from "../constants";
import { publicAuthLoader } from "./loaders/public-auth-loader";
import { createBrowserRouter, redirect } from "react-router-dom";
import { protectedAuthLoader } from "./loaders/protected-auth.loader";

export const router = createBrowserRouter([
	{
		path: paths.ROOT,
		loader: publicAuthLoader,
		children: [
			{
				path: paths.REGISTER,
				Component: Register,
			},
			{
				path: paths.LOGIN,
				Component: Login,
			},
			{
				path: paths.LOGOUT,
				loader: () => {
					localStorage.removeItem(LOCAL_STORAGE_CLEVERTASK_ITEM);
					return redirect(paths.LOGIN);
				},
			},
		],
	},
	{
		path: paths.USER.ROOT,
		loader: protectedAuthLoader,
		children: [
			{
				path: paths.USER.OVERVIEW,
				Component: Overview,
			},
		],
	},
]);
