import { useFields } from "../hooks/useFields";
import { useNavigate } from "react-router";
import { UserContext } from "../userComponents/UserContext";
import { useContext } from "react";
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

export const CreateMoodForm = () => {
	const naviagte = useNavigate();

	const { currUser, createMood } = useContext(UserContext);

	const [formData, handleChange, resetForm, formErrors, setFormErrors] =
		useFields({
			mood: "",
			createdBy: `${currUser.username}`,
		});

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		try {
			const moodID = await createMood(formData.mood);
			resetForm();
			naviagte(`/moods/${moodID}`);
			toast.success("New mood created!");
		} catch (err) {
			setFormErrors(err);
		}
	};

	return (
		<div className="MoodForm">
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
					<h3 className="mb-3">Create Mood</h3>
					<Card>
						<CardBody>
							<Form onSubmit={handleSubmit}>
								<FormGroup>
									<Label for="mood">Mood Name</Label>
									<Input
										id="mood"
										name="mood"
										value={formData.mood}
										onChange={handleChange}
										maxLength={255}
										required
									/>
								</FormGroup>
								<FormGroup>
									<Label for="createdBy">Created By</Label>
									<Input
										id="createdBy"
										name="createdBy"
										value={formData.createdBy}
										disabled
									/>
								</FormGroup>

								{formErrors.length !== 0 && (
									<Alert color="danger">
										<p className="small mb-0">{formErrors}</p>
									</Alert>
								)}
								<div className="d-flex justify-content-around">
									<Button color="primary">Create</Button>
								</div>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};
