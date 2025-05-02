import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Api } from "../api/api";
import { MovieCardList } from "./MovieCardList";
import { SearchBar } from "../SearchBar";

export const MovieSearch = () => {
	const [movies, setMovies] = useState([]);
	const [header, setHeader] = useState("Trending Movies");
	const [searchParams] = useSearchParams();
	const keyword = searchParams.get("keyword");

	async function getTrendingMovies() {
		try {
			const result = await Api.getTrendingMovies();
			setHeader("Trending Movies");
			setMovies(result);
		} catch (err) {
			console.error(err);
		}
	}

	async function movieSearch(keyword) {
		const movies = await Api.searchMovie(keyword);
		setHeader(`Search results for "${keyword}"`);
		setMovies(movies);
	}

	useEffect(() => {
		if (keyword && keyword.trim()) {
			movieSearch(keyword);
		} else {
			getTrendingMovies();
		}
	}, [keyword]);

	return (
		<>
			<SearchBar
				search={movieSearch}
				placeholder="Search for a movie title..."
			/>
			<h1 className="text-light">{header}</h1>
			{movies && movies.length ? (
				<MovieCardList movies={movies} />
			) : (
				<p>No movies found</p>
			)}
		</>
	);
};
