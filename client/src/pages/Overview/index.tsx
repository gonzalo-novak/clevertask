import { endpoints } from "../../constants";
import { useFetch } from "../../utils/fetch-data";
import { FirstGoalMessage } from "./components/FirstGoalMessage";

export const Overview = () => {
	const { data } = useFetch<{ overview: null | Record<string, unknown> }>(
		endpoints.userOverview,
		{ withInitialCall: true }
	);

	return !data.overview ? <FirstGoalMessage /> : null;
};
