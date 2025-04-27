import {
	Card,
	CardBody,
	CardTitle,
	CardText,
	CardImg,
	Row,
	Col,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from "reactstrap";
import { useState, useContext } from "react";
import { PosterBaseUrl } from "../config";
import "./MovieDetailCard.css";
import { Api } from "../api/api";
import { UserContext } from "../userComponents/UserContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export const MovieDetailCard = ({ movie, credits }) => {
	const navigate = useNavigate();
	const { currUser, currUserMoods } = useContext(UserContext);
	const posterUrl = PosterBaseUrl + "w500" + movie.poster_path;

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const toggle = () => setDropdownOpen((prevState) => !prevState);

	const handleClick = async (evt, mood) => {
		evt.preventDefault();
		const exist = await Api.addMovieToMood({
			moodId: mood.id,
			movieId: movie.id,
			username: mood.createdBy,
		});
		navigate(`/moods/${mood.id}`);
		exist
			? toast.success("Success")
			: toast.warn("Movie already exists in your list");
	};

	return (
		<Card className="m-3 bg-dark text-white movie-card">
			<Row className="g-0">
				<Col md="4">
					<CardImg
						src={posterUrl}
						alt={movie.title}
						className="img-fluid rounded-start"
					/>
				</Col>
				<Col md="8">
					<CardBody>
						<CardTitle tag="h3">{movie.title}</CardTitle>
						<div className="text-start">
							<CardText>Director: {credits.director}</CardText>
							<CardText>Main cast: {credits.cast.join(", ")}</CardText>
							<CardText>
								Genres: {movie.genres.map(({ name }) => name).join(", ")}
							</CardText>
							Description:
							<CardText>{movie.overview}</CardText>
							<CardText>
								<small>
									{movie.status === "Released" ? (
										<>Released: {movie.release_date}</>
									) : (
										<>Status: {movie.status}</>
									)}
								</small>
							</CardText>
						</div>
						{currUser && (
							<div className="mt-3">
								<Dropdown
									isOpen={dropdownOpen}
									toggle={toggle}
									direction="down"
									className="text-start"
								>
									<DropdownToggle caret color="danger">
										Add to my list
									</DropdownToggle>
									<DropdownMenu>
										<DropdownItem header>Pick a mood list</DropdownItem>
										{currUserMoods.map((m) => (
											<DropdownItem
												key={m.id}
												onClick={(evt) => handleClick(evt, m)}
											>
												{m.mood}
											</DropdownItem>
										))}
									</DropdownMenu>
								</Dropdown>
							</div>
						)}
					</CardBody>
				</Col>
			</Row>
		</Card>
	);
};
