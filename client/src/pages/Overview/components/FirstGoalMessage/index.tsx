import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useUserFetch } from "../../../../hooks/useUserFetch";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../../routes/paths";

export const FirstGoalMessage = () => {
	const { name } = useUserFetch();
	const navigate = useNavigate();

	const handleLogout = () => navigate(paths.LOGOUT);

	return (
		<Stack direction="column" spacing={10}>
			<Box>
				<Heading textAlign="center">Hello {name}!</Heading>
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
