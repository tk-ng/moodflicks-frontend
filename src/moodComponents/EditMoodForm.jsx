import { useFields } from "../hooks/useFields";
import { useNavigate, useParams, Navigate } from "react-router";
import { Api } from "../api/api";
import { UserContext } from "../userComponents/UserContext";
import { useContext, useEffect, useState } from "react";
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

export const EditMoodForm = () => {
	const params = useParams();
	const naviagte = useNavigate();

	const { currUser } = useContext(UserContext);
	const [mood, setMood] = useState();

	const [
		formData,
		handleChange,
		resetForm,
		formErrors,
		setFormErrors,
		setFormData,
	] = useFields({
		mood: "",
		createdBy: "",
	});

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		try {
			await Api.saveMoodChanges({
				id: params.id,
				name: formData.mood,
				username: mood.createdBy,
			});
			resetForm();
			naviagte(`/moods/${params.id}`);
			toast.success("Mood changes saved!");
		} catch (err) {
			setFormErrors(err);
		}
	};

	const handleDelete = async (evt) => {
		evt.preventDefault();
		await Api.deleteMood({ id: params.id, username: mood.createdBy });
		naviagte("/");
		toast.success("Mood deleted");
	};

	useEffect(() => {
		async function getMoodDetail(id) {
			const moodResult = await Api.getMood(id);
			setMood(moodResult);
			setFormData({ mood: moodResult.mood, createdBy: moodResult.createdBy });
		}

		getMoodDetail(params.id);
	}, [params.id]);

	if (mood && !(mood.createdBy === currUser.username || currUser.isAdmin)) {
		toast.warn("You're not authorized to edit this mood");
		return <Navigate to={`/moods/${mood.id}`} />;
	}

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
					<h3 className="mb-3">Edit Mood</h3>
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
										required
										maxLength={255}
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
									<Button color="primary">Save Changes</Button>
									<Button color="danger" onClick={handleDelete}>
										Delete Mood
									</Button>
								</div>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};
