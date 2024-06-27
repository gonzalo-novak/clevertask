import { RedirectFunction, redirect } from "react-router-dom";
import { LOCAL_STORAGE_CLEVERTASK_ITEM } from "../constants";
import { paths } from "../routes/paths";

export const fetchData = async <T>(
	url: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	options?: RequestInit & { useAuth?: boolean; payload?: Record<any, any> }
): Promise<{ isStatusOK: boolean; status: number } & TFetchResponse<T>> => {
	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			...(options?.useAuth
				? {
						Authorization: localStorage.getItem(LOCAL_STORAGE_CLEVERTASK_ITEM)!,
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  }
				: {}),
		},
		body: JSON.stringify(options?.payload),
		...options,
	});

	if (response.status === 401) {
		localStorage.removeItem(LOCAL_STORAGE_CLEVERTASK_ITEM);
		redirect(paths.LOGIN) as unknown as RedirectFunction;
	}

	const { data, message } = (
		response.status === 204 ? {} : await response.json()
	) as TFetchResponse<T>;

	return {
		isStatusOK: response.ok,
		status: response.status,
		data,
		message,
	};
};

type TFetchResponse<T> = {
	data?: T;
	message?: string;
};
