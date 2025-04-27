import { MovieCard } from "./MovieCard";
import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import { PosterBaseUrl } from "../config";
import userEvent from "@testing-library/user-event";

describe("Render the MovieCard component", function () {
	const testMovie = {
		id: "testMovieId",
		overview: "testMovieOverview",
		posterPath: "testMoviePosterPath",
		releaseDate: "testMovieReleaseDate",
		title: "testMovieTitle",
		editAuth: false,
		handleRemove: vi.fn(),
	};
	it("mounts without crashing", async function () {
		const { container } = render(
			<MemoryRouter>
				<MovieCard />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
	});

	it("matches snapshot", async function () {
		const { asFragment } = render(
			<MemoryRouter>
				<MovieCard />
			</MemoryRouter>
		);
		expect(asFragment).toMatchSnapshot();
	});

	it("renders movie details WITHOUT the Remove buttons", async function () {
		render(
			<MemoryRouter>
				<MovieCard
					id={testMovie.id}
					overview={testMovie.overview}
					posterPath={testMovie.posterPath}
					releaseDate={testMovie.releaseDate}
					title={testMovie.title}
					editAuth={testMovie.editAuth}
					handleRemove={testMovie.handleRemove}
				/>
			</MemoryRouter>
		);
		expect(
			screen.getByText(testMovie.title, { selector: "h5" })
		).toBeInTheDocument();

		expect(
			screen.getByText(`released: ${testMovie.releaseDate}`, { selector: "h6" })
		).toBeInTheDocument();

		// The Remove button should not be displayed
		expect(
			screen.queryByText("Remove", { selector: "button" })
		).not.toBeInTheDocument();

		expect(screen.getByAltText("Movie Poster")).toHaveAttribute(
			"src",
			PosterBaseUrl + "w185" + testMovie.posterPath
		);
	});

	it("renders movie details WITH the Remove buttons", async function () {
		render(
			<MemoryRouter>
				<MovieCard
					id={testMovie.id}
					overview={testMovie.overview}
					posterPath={testMovie.posterPath}
					releaseDate={testMovie.releaseDate}
					title={testMovie.title}
					editAuth={true}
					handleRemove={testMovie.handleRemove}
				/>
			</MemoryRouter>
		);
		const user = userEvent.setup();

		expect(
			screen.getByText(testMovie.title, { selector: "h5" })
		).toBeInTheDocument();

		expect(
			screen.getByText(`released: ${testMovie.releaseDate}`, { selector: "h6" })
		).toBeInTheDocument();

		// The Remove button should be displayed
		const removeBtn = screen.getByText("Remove", { selector: "button" });
		expect(removeBtn).toBeInTheDocument();

		expect(screen.getByAltText("Movie Poster")).toHaveAttribute(
			"src",
			PosterBaseUrl + "w185" + testMovie.posterPath
		);

		await user.click(removeBtn);
		expect(testMovie.handleRemove).toHaveBeenCalledWith(
			expect.anything(),
			testMovie.id
		);
	});
});
