import { useState, useEffect, useContext } from "react";
import { useParams, Link, Navigate } from "react-router";
import { Button, Badge } from "reactstrap";
import { Api } from "../api/api";
import { MovieCardList } from "../movieComponents/MovieCardList";
import { RecommendedMoviesModal } from "../overlayComponents/RecommendedMoviesModal";
import { UserContext } from "../userComponents/UserContext";
import { SimilarMoodOffcanvas } from "../overlayComponents/SimilarMoodOffcanvas";
import { toast } from "react-toastify";
import { VoteMoodButtons } from "./VoteMoodButtons";

export const MoodDetail = () => {
	const params = useParams();
	const { currUser } = useContext(UserContext);

	const [isLoading, setIsLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	const [mood, setMood] = useState();
	const [similarMoods, setSimilarMoods] = useState([]);
	const [movies, setMovies] = useState([]);
	const [recMovies, setRecMovies] = useState([]);

	const [modal, setModal] = useState(false);

	const [canvas, setCanvas] = useState(false);
	const canvasToggle = () => setCanvas(!canvas);

	const modalToggle = () => setModal(!modal);

	const handleRemove = async (evt, movieId) => {
		evt.stopPropagation();
		await Api.removeMovieFromMood({
			moodId: mood.id,
			movieId,
			username: mood.createdBy,
		});
		setMovies((movies) => movies.filter((m) => m.id !== movieId));
		toast.success("Movie removed successfully from the mood list.");
	};

	async function getMoodAndMovies(id) {
		setCanvas(false);
		if (id === "new") {
			setNotFound(true);
			setIsLoading(false);
			return;
		}
		try {
			setIsLoading(true);
			setNotFound(false);

			const [moodResult, moviesResult, recMoviesResult, similarMoodResult] =
				await Promise.all([
					Api.getMood(id),
					Api.getMoviesByMood(id),
					Api.getRecommendedMoviesByMood(id),
					Api.getSimilarMoods(id),
				]);
			setMood(moodResult);
			setMovies(moviesResult);
			setRecMovies(recMoviesResult);
			setSimilarMoods(similarMoodResult);
		} catch (err) {
			console.error("Mood not found:", err);
			setNotFound(true);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		getMoodAndMovies(params.id);
	}, [params.id]);

	if (isLoading) return <p>Loading...</p>;
	if (notFound) {
		if (params.id !== "new") {
			toast.warning(`mood id: ${params.id} could not be found.`);
		} else {
			toast.warning(`Please log in to create a new mood.`);
		}
		return <Navigate to="/" />;
	}
	return (
		<div>
			<div>
				<span className="display-6">{mood.mood}</span>
				<div className="ms-2">
					<Badge pill>score: {mood.totalVotes}</Badge>{" "}
					<Badge pill>
						{mood.count} {mood.count > 1 ? "movies" : "movie"}
					</Badge>
				</div>
				{currUser &&
					(mood.createdBy === currUser.username || currUser.isAdmin ? (
						<Button tag={Link} to={`/moods/${params.id}/edit`} className="m-3">
							Edit Mood
						</Button>
					) : (
						<VoteMoodButtons moodId={params.id} setMood={setMood} />
					))}
			</div>
			<small>
				created by:{" "}
				<Link to={`/users/${mood.createdBy}`}>{mood.createdBy}</Link>
			</small>
			{movies.length ? (
				<>
					<div className="container mb-5 d-flex justify-content-center">
						{recMovies.length > 0 && (
							<>
								<Button color="dark" onClick={modalToggle}>
									More Movies Like This
								</Button>
								<RecommendedMoviesModal
									recMovies={recMovies}
									modal={modal}
									toggle={modalToggle}
								/>
							</>
						)}

						{similarMoods.length > 0 && (
							<>
								<Button color="dark" onClick={canvasToggle} className="ms-3">
									Similar Moods
								</Button>
								<SimilarMoodOffcanvas
									canvas={canvas}
									toggle={canvasToggle}
									moods={similarMoods}
								/>
							</>
						)}
					</div>

					<MovieCardList
						movies={movies}
						editAuth={
							currUser &&
							(currUser.username === mood.createdBy || currUser.isAdmin)
						}
						handleRemove={handleRemove}
					/>
				</>
			) : (
				<p>
					This mood list does not have any movies yet...{" "}
					{currUser &&
						(mood.createdBy === currUser.username || currUser.isAdmin) && (
							<Link
								className="text-dark text-decoration-underline"
								to="/movies/"
							>
								Start adding movies
							</Link>
						)}
				</p>
			)}
		</div>
	);
};
