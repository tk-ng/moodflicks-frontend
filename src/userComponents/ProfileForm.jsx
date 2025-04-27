import { useFields } from "../hooks/useFields";
import { useNavigate, useParams, Navigate } from "react-router";
import { Api } from "../api/api";
import { UserContext } from "./UserContext";
import { useContext, useState, useEffect } from "react";
import {
	Form,
	FormGroup,
	Label,
	Input,
	Button,
	Row,
	Col,
	Card,
	CardBody,
	Alert,
} from "reactstrap";
import { toast } from "react-toastify";

export const ProfileForm = () => {
	const { currUser, setCurrentUser } = useContext(UserContext);

	const params = useParams();
	const naviagte = useNavigate();
	const [profileUser, setProfileUser] = useState();

	const [isLoading, setIsLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	const [
		formData,
		handleChange,
		resetForm,
		formErrors,
		setFormErrors,
		setFormData,
	] = useFields({
		firstName: "",
		lastName: "",
		email: "",
	});

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		try {
			const updatedUser = await Api.saveChanges({
				username: profileUser.username,
				data: formData,
			});
			if (currUser.username === profileUser.username)
				setCurrentUser((currentUser) => ({
					...currentUser,
					data: updatedUser,
				}));
			resetForm();
			toast.success("Profile Updated Successfully");
			naviagte(`/users/${profileUser.username}`);
		} catch (err) {
			setFormErrors(err);
		}
	};

	async function getUserInfo(username) {
		try {
			setIsLoading(true);
			setNotFound(false);

			const userResult = await Api.getUser(username);
			setProfileUser(userResult);
			setFormData({
				firstName: userResult.firstName,
				lastName: userResult.lastName,
				email: userResult.email,
			});
		} catch (err) {
			console.error("User not found:", err);
			setNotFound(true);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		getUserInfo(params.username);
	}, [params.username]);

	if (isLoading) return <p>Loading...</p>;
	if (notFound) {
		toast.warning(`username: ${params.username} could not be found.`);

		return <Navigate to="/" />;
	}

	if (!currUser.isAdmin && params.username !== currUser.username) {
		toast.warning(`You are not logged in as ${params.username}.`);
		return <Navigate to={`/users/${currUser.username}`} />;
	}

	return (
		<div className="ProfileForm">
			<Row>
				<Col
					className="container"
					md={{
						offset: 3,
						size: 6,
					}}
					sm="12"
					lg={{
						offset: 4,
						size: 4,
					}}
				>
					<h3 className="mb-3">Profile</h3>
					<Card>
						<CardBody>
							<Form onSubmit={handleSubmit}>
								<FormGroup>
									<Label for="username">Username</Label>
									<Input
										id="username"
										name="username"
										value={params.username}
										disabled
									/>
								</FormGroup>
								<FormGroup>
									<Label for="firstName">First Name</Label>
									<Input
										id="firstName"
										name="firstName"
										value={formData.firstName}
										onChange={handleChange}
										required
									/>
								</FormGroup>
								<FormGroup>
									<Label for="lastName">Last Name</Label>
									<Input
										id="lastName"
										name="lastName"
										value={formData.lastName}
										onChange={handleChange}
										required
									/>
								</FormGroup>
								<FormGroup>
									<Label for="email">Email</Label>
									<Input
										id="email"
										name="email"
										type="email"
										value={formData.email}
										onChange={handleChange}
										required
									/>
								</FormGroup>
								{formErrors.length !== 0 && (
									<Alert color="danger">
										<p className="small mb-0">{formErrors}</p>
									</Alert>
								)}
								<div className="d-grid">
									<Button color="primary">Save Changes</Button>
								</div>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};
