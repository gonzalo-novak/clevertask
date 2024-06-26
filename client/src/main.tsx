import React from "react";
import { router } from "./routes";
import { theme } from "./theme.ts";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<RouterProvider router={router} />
		</ChakraProvider>
	</React.StrictMode>
);
