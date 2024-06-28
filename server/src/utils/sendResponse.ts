type TResponseError = { message: string };
type TResponse<T = {}> = {
	data: T;
	errors: TResponseError[];
};

export const sendSuccessfulResponseObject = <T>(payload: T): TResponse<T> => ({
	data: payload,
	errors: [],
});

export const sendErrorResponseObject = (
	errors: TResponse["errors"] | TResponseError
): TResponse => {
	return { data: {}, errors: !Array.isArray(errors) ? [errors] : errors };
};
