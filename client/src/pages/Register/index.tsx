import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Text,
	Stack,
	useToast,
} from "@chakra-ui/react";
import { paths } from "../../routes/paths";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../utils/fetch-data";
import { LOCAL_STORAGE_CLEVERTASK_ITEM, endpoints } from "../../constants";

export const Register = () => {
	const toast = useToast();
	const navigate = useNavigate();
	const { startFetching, isLoading } = useFetch<TRegisterResponseData>(
		endpoints.registerUser
	);
	const [formValues, setFormValues] = useState<TRegisterFormFields>({
		name: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [formFieldErrors, setFormFieldErrors] =
		useState<TRegisterFormFieldErrors>({});

	const getFormFieldError = (key: keyof typeof formFieldErrors) =>
		formFieldErrors[key];

	const isFormError = (key: keyof typeof formFieldErrors) =>
		Boolean(getFormFieldError(key));

	const renderFormError = (key: keyof typeof formFieldErrors) =>
		isFormError(key) ? (
			<FormErrorMessage>{getFormFieldError(key)}</FormErrorMessage>
		) : null;

	const handleFormChange = ({
		currentTarget: { name, value },
	}: FormEvent<HTMLInputElement>) =>
		setFormValues((f) => ({ ...f, [name]: value }));

	const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const { isErrors, errors } = validateFormFields(formValues);

		if (isErrors) {
			return setFormFieldErrors(errors);
		}

		setFormFieldErrors({});

		try {
			const payload = { ...formValues } as Partial<TRegisterFormFields>;
			delete payload.confirmPassword;

			const { data, isError } = await startFetching({
				method: "POST",
				payload,
			});

			if (isError) throw new Error();

			localStorage.setItem(LOCAL_STORAGE_CLEVERTASK_ITEM, data.token);
			navigate(paths.USER.OVERVIEW);
		} catch (error) {
			toast({
				title: "Oops!",
				description: "We could not create your account for you.",
				status: "error",
				isClosable: true,
			});
		}
	};

	return (
		<Stack direction="column" spacing={2}>
			<Text as="h1" fontSize="2xl" textAlign="center">
				Sign up one time. Keep track of your goals and achievements{" "}
				<Text as="span" style={{ fontWeight: 700 }}>
					anytime.
				</Text>
			</Text>

			<form onSubmit={handleFormSubmit}>
				<FormControl isRequired isInvalid={isFormError("name")}>
					<FormLabel>Name</FormLabel>
					<Input
						name="name"
						onChange={handleFormChange}
						defaultValue={formValues.name}
					/>
					{renderFormError("name")}
				</FormControl>

				<FormControl isRequired isInvalid={isFormError("lastName")}>
					<FormLabel>Last name</FormLabel>
					<Input
						name="lastName"
						onChange={handleFormChange}
						defaultValue={formValues.lastName}
					/>
					{renderFormError("lastName")}
				</FormControl>

				<FormControl isRequired isInvalid={isFormError("email")}>
					<FormLabel>Email</FormLabel>
					<Input
						type="email"
						name="email"
						onChange={handleFormChange}
						defaultValue={formValues.email}
					/>
					{renderFormError("email")}
				</FormControl>

				<FormControl isRequired isInvalid={isFormError("password")}>
					<FormLabel>Password</FormLabel>
					<Input
						type="password"
						name="password"
						onChange={handleFormChange}
						defaultValue={formValues.password}
					/>
					{renderFormError("password")}
				</FormControl>

				<FormControl isRequired isInvalid={isFormError("confirmPassword")}>
					<FormLabel>Confirm password</FormLabel>
					<Input
						type="password"
						name="confirmPassword"
						onChange={handleFormChange}
						defaultValue={formValues.confirmPassword}
					/>
					{renderFormError("confirmPassword")}
				</FormControl>
				<Button
					isLoading={isLoading}
					loadingText="Signing up..."
					type="submit"
					colorScheme="brand"
					margin="auto"
					marginTop="1rem"
					display="flex"
					width="100%"
				>
					Sign up
				</Button>
			</form>
		</Stack>
	);
};

function validateFormFields(formValues: TRegisterFormFields) {
	let errors: TRegisterFormFieldErrors = {};

	// Validating the form fields are not empty
	errors = Object.keys(formValues).reduce((acc, _key) => {
		const key = _key as keyof typeof formValues;
		if (!formValues[key]) {
			acc = { ...acc, [key]: `${key} is required` };
		}
		return acc;
	}, errors);

	if (formValues.password.length && formValues.password.length < 8) {
		errors = {
			...errors,
			// file deepcode ignore NoHardcodedPasswords: It's not a hardcoded password. It's an error message for that form field
			password:
				"The password is too short. Try to think about a long phrase you like",
		};
	}

	if (formValues.password !== formValues.confirmPassword) {
		errors = {
			...errors,
			confirmPassword:
				"The password and confirm password fields do not coincide",
		};
	}

	const isErrors = Object.keys(errors).length;

	return { isErrors, errors };
}

type TRegisterFormFields = {
	name: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
};

type TRegisterFormFieldErrors = {
	[key in keyof TRegisterFormFields]?: string;
};

type TRegisterResponseData = {
	token: string;
};
