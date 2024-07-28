import "@radix-ui/themes/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";

import { Flex, Text, Button } from "@radix-ui/themes";

export default function MyApp() {
	return (
		<Flex direction="column" gap="2">
			<Text>Hello from Radix Themes :)</Text>
			<Button>Let's go</Button>
		</Flex>
	);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Theme accentColor="orange">
			<MyApp />
		</Theme>
	</React.StrictMode>
);
