import { useEffect, useState } from "react";
import {
	Form,
	FormGroup,
	Input,
	Button,
	InputGroup,
	Row,
	Col,
} from "reactstrap";
import { useSearchParams } from "react-router";

export const SearchBar = ({ search }) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const keyword = searchParams.get("keyword") || "";
	const [formData, setFormData] = useState(keyword);

	useEffect(() => {
		setFormData(keyword);
	}, [keyword]);

	const handleChange = (evt) => {
		setFormData(evt.target.value);
	};

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		if (formData.trim()) {
			setSearchParams({ keyword: formData });
			search(formData);
		}
	};
	console.log(search);
	console.log(search.name);
	const placeholder =
		search.name === "movieSearch"
			? "Search for a movie title..."
			: "Search by mood...";

	return (
		<Row className="mb-3">
			<Col xs="1"></Col>
			<Col>
				<Form onSubmit={handleSubmit} className="SearchBar">
					<FormGroup>
						<InputGroup>
							<Input
								name="search"
								placeholder={placeholder}
								value={formData}
								onChange={handleChange}
								required
							/>
							<Button>Search</Button>
						</InputGroup>
					</FormGroup>
				</Form>
			</Col>
			<Col xs="1"></Col>
		</Row>
	);
};
