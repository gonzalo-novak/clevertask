import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";
import { paths } from "../../routes/paths";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useFetch } from "../../utils/fetch-data";
import { LOCAL_STORAGE_CLEVERTASK_ITEM, endpoints } from "../../constants";

export const Login = () => {
	const toast = useToast();
	const navigate = useNavigate();

	const [formErrors, setFormErrors] = useState<Partial<TLoginFormValues>>({});
	const [formValues, setFormValues] = useState<TLoginFormValues>({
		email: "",
		password: "",
	});

	const { startFetching, isLoading } = useFetch<TLoginResponse>(
		endpoints.loginUser
	);

	const handleFormChange = ({
		currentTarget: { name, value },
	}: FormEvent<HTMLInputElement>) =>
		setFormValues((f) => ({ ...f, [name]: value }));

	const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		let errors: Partial<TLoginFormValues> = {};

		if (!formValues.email) {
			errors = { ...errors, email: "The email field cannot be empty" };
		}

		if (!formValues.password) {
			// file deepcode ignore NoHardcodedPasswords: It's not a hardcoded password. It's an error message for that form field
			errors = { ...errors, password: "The password field cannot be empty" };
		}

		if (Object.keys(errors).length) {
			return setFormErrors(errors);
		}

		try {
			const { data, isError } = await startFetching({
				method: "POST",
				payload: formValues,
			});

			if (isError) throw new Error();

			localStorage.setItem(LOCAL_STORAGE_CLEVERTASK_ITEM, data.token);
			navigate(paths.USER.OVERVIEW);
		} catch (error) {
			toast({
				title: "Oops!",
				description: "There was an error while signing in...",
				status: "error",
				isClosable: true,
			});
		}
	};

	return (
		<Stack direction="column" spacing={5}>
			<Box>
				<Heading textAlign="center">Nice to see you again!</Heading>
				<Text textAlign="center">
					Are you ready for continuing to make progress on your projects?
				</Text>
			</Box>

			<form onSubmit={handleFormSubmit}>
				<FormControl isRequired isInvalid={!!formErrors.email}>
					<FormLabel>Email</FormLabel>
					<Input type="email" name="email" onChange={handleFormChange} />
				</FormControl>

				<FormControl isRequired isInvalid={!!formErrors.password}>
					<FormLabel>Password</FormLabel>
					<Input type="password" name="password" onChange={handleFormChange} />
				</FormControl>

				<Button
					isLoading={isLoading}
					loadingText="Signing in..."
					type="submit"
					colorScheme="brand"
					margin="2rem auto"
					display="flex"
					width="100%"
				>
					Sign in
				</Button>

				<Button
					width="100%"
					colorScheme="gray"
					variant="ghost"
					onClick={() => navigate(paths.REGISTER)}
				>
					Are you new? Sign up here
				</Button>
			</form>
		</Stack>
	);
};

type TLoginFormValues = {
	email: string;
	password: string;
};

type TLoginResponse = {
	token: string;
};
