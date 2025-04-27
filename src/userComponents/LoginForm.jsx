import { useFields } from "../hooks/useFields";
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
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export const LoginForm = ({ login }) => {
	const navigate = useNavigate();

	const [formData, handleChange, resetForm, formErrors, setFormErrors] =
		useFields({
			username: "",
			password: "",
		});

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		try {
			await login(formData);
			resetForm();
			navigate("/");
			toast.success(`Welcome back, ${formData.username}!`);
		} catch (err) {
			setFormErrors(err);
		}
	};

	return (
		<div className="LoginForm">
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
					<h3 className="mb-3">Log In</h3>
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
