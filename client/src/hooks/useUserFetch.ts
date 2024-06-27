import { useCallback, useEffect, useState } from "react";
import { fetchData } from "../utils/fetch-data";
import { endpoints } from "../constants";

export const useUserFetch = () => {
	const [user, setUser] = useState<TUser>({
		name: "",
		lastName: "",
		email: "",
	});

	const fetchUser = useCallback(async () => {
		const { data, isStatusOK } = await fetchData<{ user: TUser }>(
			endpoints.userProfile,
			{
				useAuth: true,
			}
		);

		if (isStatusOK) {
			setUser(data!.user);
		}
	}, []);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	return user;
};

type TUser = {
	name: string;
	lastName: string;
	email: string;
};
