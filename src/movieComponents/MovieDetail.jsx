import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router";
import { Button } from "reactstrap";
import { Api } from "../api/api";
import { AppearedOnOffcanvas } from "../overlayComponents/AppearedOnOffcanvas";
import { MovieDetailCard } from "./MovieDetailCard";
import { toast } from "react-toastify";

export const MovieDetail = () => {
	const params = useParams();

	const [movie, setMovie] = useState();
	const [credits, setCredits] = useState();
	const [moods, setMoods] = useState([]);

	const [isLoading, setIsLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	const [canvas, setCanvas] = useState(false);
	const toggle = () => setCanvas(!canvas);

	async function getMovie() {
		try {
			setIsLoading(true);
			setNotFound(false);

			const [movieResult, movieCredits, moodsResult] = await Promise.all([
				Api.getMovieDetail(params.id),
				Api.getMovieCredits(params.id),
				Api.getMoodsByMovie(params.id),
			]);

			setMovie(movieResult);
			setCredits(movieCredits);
			setMoods(moodsResult);
		} catch (err) {
			setNotFound(true);
			console.error(err);
			return <Navigate to="/movies" />;
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		getMovie();
	}, []);

	if (isLoading) return <p>Loading...</p>;
	if (notFound) {
		toast.warning(`movie id: ${params.id} could not be found.`);
		return <Navigate to="/movies" />;
	}

	return (
		<div className="d-flex flex-column align-items-center">
			<MovieDetailCard movie={movie} credits={credits} moods={moods} />
			<Button color="dark" onClick={toggle} className="mb-5">
				Appeared On...
			</Button>
			<AppearedOnOffcanvas canvas={canvas} toggle={toggle} moods={moods} />
		</div>
	);
};
