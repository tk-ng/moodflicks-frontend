import {
	Card,
	CardBody,
	CardTitle,
	CardSubtitle,
	CardText,
	Button,
} from "reactstrap";
import { PosterBaseUrl } from "../config";
import { useNavigate } from "react-router";

export const MovieCard = ({
	id,
	overview,
	posterPath,
	releaseDate,
	title,
	editAuth,
	handleRemove,
}) => {
	const imageSrc = posterPath
		? PosterBaseUrl + "w185" + posterPath
		: "/img/placeholder.png";
	const navigate = useNavigate();

	return (
		<Card
			style={{
				width: "20rem",
			}}
			className="MovieCard m-1 p-3"
			onClick={() => navigate(`/movies/${id}`)}
		>
			<img alt="Movie Poster" src={imageSrc} />
			<CardBody>
				<CardTitle tag="h5">{title}</CardTitle>
				<CardSubtitle className="mb-2 text-light fs-6" tag="h6">
					released: {releaseDate}
				</CardSubtitle>
				<CardText className="MovieCardTruncate">{overview}</CardText>
				{editAuth && (
					<Button color="danger" onClick={(evt) => handleRemove(evt, id)}>
						Remove
					</Button>
				)}
			</CardBody>
		</Card>
	);
};
