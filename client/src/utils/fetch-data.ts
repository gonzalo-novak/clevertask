import { RedirectFunction, redirect } from "react-router-dom";
import { LOCAL_STORAGE_CLEVERTASK_ITEM } from "../constants";
import { paths } from "../routes/paths";
import { useCallback, useEffect, useState } from "react";

export const fetchData = async <T>(
	url: TFetchDataArguments["url"],
	options?: TFetchDataArguments["options"]
): Promise<TFetchResponse<T>> => {
	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			...(options?.withoutCredentials
				? null
				: {
						Authorization: localStorage.getItem(LOCAL_STORAGE_CLEVERTASK_ITEM)!,
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  }),
		},
		body: JSON.stringify(options?.payload),
		...options,
	});

	if (response.status === 401) {
		localStorage.removeItem(LOCAL_STORAGE_CLEVERTASK_ITEM);
		redirect(paths.LOGIN) as unknown as RedirectFunction;
	}

	const { data, errors } = (await response.json()) as TFetchResponse<T>;

	return {
		data,
		errors,
	};
};

export const useFetch = <T>(
	url: TFetchDataArguments["url"],
	options?: TFetchDataArguments["options"]
) => {
	const { withInitialCall = false, ...restOptions } = options || {};

	const [isLoading, setIsLoading] = useState(withInitialCall ? true : false);
	const [{ data, errors }, setData] = useState<TFetchResponse<T>>({
		data: {} as T,
		errors: [],
	});

	const startFetching = useCallback(
		async (overrideOptions?: Partial<TFetchDataArguments["options"]>) => {
			setIsLoading(true);
			const response = await fetchData<T>(url, {
				...restOptions,
				...overrideOptions,
			});
			setData(response);
			setIsLoading(false);

			return {
				isError: Boolean(response.errors.length),
				...response,
			};
		},
		[url, restOptions]
	);

	useEffect(() => {
		if (withInitialCall) {
			startFetching();
		}
	}, []);

	return {
		data,
		errors,
		isError: Boolean(errors.length),
		isLoading,
		startFetching,
	};
};

export type TFetchResponse<T> = {
	data: T;
	errors: { messages: string }[];
};

type TFetchDataArguments = {
	url: string;
	options: RequestInit & {
		withInitialCall?: boolean;
		withoutCredentials?: boolean;
		payload?: Record<string, unknown>;
	};
};
