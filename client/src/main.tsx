import React from "react";
import App from "./App.tsx";
import { theme } from "./theme.ts";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<App />
		</ChakraProvider>
	</React.StrictMode>
);
