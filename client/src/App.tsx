import { Heading, Button, Text, Box, Center } from "@chakra-ui/react";
import { useState } from "react";
import { useReward } from "react-rewards";

function App() {
	const [isTaskCompleted, setIsTaskCompleted] = useState(false);
	const { reward } = useReward("completedTaskId", "confetti", {
		elementCount: 100,
	});

	const handleOnCompletingTask = () => {
		setIsTaskCompleted(true);
		reward();
	};

	return (
		<Center height="100vh" padding="2rem">
			<Box maxWidth={580}>
				<Box marginBottom={10}>
					<Heading size="lg">Hello, CleverTask.</Heading>
					<Text marginTop={2}>
						Imagine discovering paths you hadn't considered by talking about
						your goals. Meet Sophia, your AI assistant. She helps you organize
						your goals and ensures nothing is overlooked. She gives clarity on
						how to achieve your objectives and how they connect by just chatting
						to her.
					</Text>
				</Box>

				<Button
					isDisabled={isTaskCompleted}
					borderRadius={0}
					colorScheme={isTaskCompleted ? "green" : "brand"}
					marginRight={2}
					onClick={handleOnCompletingTask}
				>
					<span id="completedTaskId"></span>
					{isTaskCompleted ? "Task completed! Good job!" : "Complete task"}
				</Button>

				<Button
					borderRadius={0}
					borderColor="solitude.900"
					color="solitude.900"
					variant="outline"
				>
					{isTaskCompleted ? "Review chat" : "Chat with Sophia"}
				</Button>
			</Box>
		</Center>
	);
}

export default App;
