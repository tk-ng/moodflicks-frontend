import { useFields } from "../hooks/useFields";
import { useNavigate } from "react-router";
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

export const SignupForm = ({ signup }) => {
	const naviagte = useNavigate();
	const [formData, handleChange, resetForm, formErrors, setFormErrors] =
		useFields({
			username: "",
			password: "",
			firstName: "",
			lastName: "",
			email: "",
		});

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		try {
			await signup(formData);
			resetForm();
			naviagte("/");
		} catch (err) {
			setFormErrors(err);
		}
	};

	return (
		<div className="SignupForm">
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
					<h3 className="mb-3">Sign Up</h3>
					<Card>
						<CardBody>
							<Form onSubmit={handleSubmit}>
								<FormGroup>
									<Label for="username">Username</Label>
									<Input
										id="username"
										name="username"
										value={formData.username}
										onChange={handleChange}
										required
									/>
								</FormGroup>
								<FormGroup>
									<Label for="password">Password</Label>
									<Input
										id="password"
										name="password"
										type="password"
										value={formData.password}
										onChange={handleChange}
										required
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
									<Button color="primary">Submit</Button>
								</div>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};
