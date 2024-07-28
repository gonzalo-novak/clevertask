import "@radix-ui/themes/styles.css";
import "./global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Flex, Text, Button, Heading, Theme } from "@radix-ui/themes";

export default function MyApp() {
	return (
		<Flex direction="column" gap="2">
			<Heading>Hello world :)</Heading>
			<Text>Hello from Radix Themes :)</Text>
			<Button>Let's go</Button>
		</Flex>
	);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Theme accentColor="orange" scaling="110%">
			<MyApp />
		</Theme>
	</React.StrictMode>
);
