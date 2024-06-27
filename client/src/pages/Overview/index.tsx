import { useEffect, useState } from "react";
import { fetchData } from "../../utils/fetch-data";
import { endpoints } from "../../constants";
import { FirstGoalMessage } from "./components/FirstGoalMessage";

export const Overview = () => {
	const [isFirstTime, setIsFirstTime] = useState(false);

	useEffect(() => {
		(async () => {
			const { status } = await fetchData(endpoints.userOverview, {
				useAuth: true,
			});
			if (status === 204) {
				setIsFirstTime(true);
			}
		})();
	}, []);

	return isFirstTime ? <FirstGoalMessage /> : null;
};
