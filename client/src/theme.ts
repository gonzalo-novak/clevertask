import { extendTheme } from "@chakra-ui/react";

const colors = {
	brand: {
		900: "#441006",
		800: "#7e2810",
		700: "#9d2c0f",
		600: "#c63708",
		500: "#ef4d07",
		400: "#ff8a38",
		300: "#ffb471",
		200: "#ffd3a8",
		100: "#ffebd4",
		50: "#fff6ed",
	},
	solitude: {
		900: "#0b3046",
		800: "#114c69",
		700: "#0d5b7f",
		600: "#0b6b99",
		500: "#0b87be",
		400: "#18a7df",
		300: "#83d5f6",
		200: "#bde7fa",
		100: "#e1f3fd",
		50: "#ebf7fe",
	},
};

const fonts = {
	heading: `'Gabarito', sans-serif`,
	body: `'Gabarito', sans-serif`,
};

export const theme = extendTheme({ colors, fonts });
