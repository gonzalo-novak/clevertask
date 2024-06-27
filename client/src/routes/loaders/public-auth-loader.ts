import { paths } from "../paths";
import { redirect } from "react-router-dom";
import { LOCAL_STORAGE_CLEVERTASK_ITEM } from "../../constants";

export const publicAuthLoader = () => {
	if (localStorage.getItem(LOCAL_STORAGE_CLEVERTASK_ITEM)) {
		return redirect(paths.USER.OVERVIEW);
	}
	return null;
};
