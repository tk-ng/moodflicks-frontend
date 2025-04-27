import { MovieCardList } from "./MovieCardList";
import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import { PosterBaseUrl } from "../config";
import userEvent from "@testing-library/user-event";

describe("Render the MovieCardList component", function () {
	const handleRemove = vi.fn();
	const testMovies = [
		{
			id: "testMovieId1",
			overview: "testMovieOverview1",
			posterPath: "testMoviePosterPath1",
			releaseDate: "testMovieReleaseDate1",
			title: "testMovieTitle1",
		},
		{
			id: "testMovieId",
			overview: "testMovieOverview",
			posterPath: "testMoviePosterPath",
			releaseDate: "testMovieReleaseDate",
			title: "testMovieTitle",
		},
	];
	it("mounts without crashing", async function () {
		const { container } = render(
			<MemoryRouter>
				<MovieCardList movies={testMovies} editAuth={false} />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
	});

	it("matches snapshot", async function () {
		const { asFragment } = render(
			<MemoryRouter>
				<MovieCardList movies={testMovies} editAuth={false} />
			</MemoryRouter>
		);
		expect(asFragment).toMatchSnapshot();
	});

	it("renders movie details WITHOUT the Remove buttons", async function () {
		render(
			<MemoryRouter>
				<MovieCardList movies={testMovies} editAuth={false} />
			</MemoryRouter>
		);
		expect(
			screen.getByText(testMovies[0].title, { selector: "h5" })
		).toBeInTheDocument();

		expect(
			screen.getByText(`released: ${testMovies[0].releaseDate}`, {
				selector: "h6",
			})
		).toBeInTheDocument();

		// The Remove button should not be displayed
		expect(
			screen.queryByText("Remove", { selector: "button" })
		).not.toBeInTheDocument();

		// Movie posters are displayed for each movie
		screen
			.getAllByAltText("Movie Poster")
			.forEach((el, idx) =>
				expect(el).toHaveAttribute(
					"src",
					PosterBaseUrl + "w185" + testMovies[idx].posterPath
				)
			);
	});
});
