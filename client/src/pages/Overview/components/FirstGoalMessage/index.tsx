import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../../routes/paths";
import { endpoints } from "../../../../constants";
import { useFetch } from "../../../../utils/fetch-data";

export const FirstGoalMessage = () => {
	const { data, isLoading } = useFetch<TUserProfileResponse>(
		endpoints.userProfile,
		{
			withInitialCall: true,
		}
	);
	const navigate = useNavigate();

	const handleLogout = () => navigate(paths.LOGOUT);

	if (isLoading) return;

	return (
		<Stack direction="column" spacing={10}>
			<Box>
				<Heading textAlign="center">Hello {data.user.name}!</Heading>
				<Text textAlign="center">
					Let's create your first goal. Why don't we chat about it? I'll create
					a plan for you so you can achieve it without losing momentum!
				</Text>
			</Box>
			<Button colorScheme="brand">Create your first goal</Button>

			<Button colorScheme="gray" variant="ghost" onClick={handleLogout}>
				Logout
			</Button>
		</Stack>
	);
};

export type TUserProfileResponse = {
	user: {
		name: string;
		lastName: string;
		email: string;
	};
};
