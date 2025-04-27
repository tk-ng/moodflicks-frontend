import { render, screen, waitFor } from "@testing-library/react";
import { Api } from "../api/api";
import { MovieDetail } from "./MovieDetail";
import { MemoryRouter, useParams } from "react-router";
import { UserContext } from "../userComponents/UserContext";

vi.mock("../api/api", () => ({
	Api: {
		getMoods: vi.fn(),
		searchMood: vi.fn(),
		getMovieDetail: vi.fn(),
		getMovieCredits: vi.fn(),
		getMoodsByMovie: vi.fn(),
	},
}));

vi.mock("react-router", async function () {
	const mod = await vi.importActual("react-router");
	return {
		...mod,
		useParams: vi.fn(),
		useSearchParams: vi.fn(),
	};
});

const testMovie = {
	id: "testMovieId",
	title: "testMovieTitle",
	genres: [{ name: "testMovieGenre1" }],
	overview: "testMovieOverview",
	release_date: "testMovieReleaseDate",
	status: "testMovieStatus",
};

describe("Render the MovieDetail component", function () {
	useParams.mockReturnValue({ id: "testMovieId" });
	it("mounts without crashing", async function () {
		const { container, asFragment } = render(
			<MemoryRouter>
				<MovieDetail />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment).toMatchSnapshot();
	});

	it("mounts without crashing", async function () {
		Api.getMovieDetail.mockResolvedValue(testMovie);
		Api.getMovieCredits.mockResolvedValue({
			director: "testMovieDirector",
			cast: ["cast1", "cast2", "cast3"],
		});
		Api.getMoodsByMovie.mockResolvedValue([]);

		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: null,
						currUserMoods: [],
					}}
				>
					<MovieDetail />
				</UserContext.Provider>
			</MemoryRouter>
		);
		await waitFor(() =>
			expect(
				screen.getByText("testMovieTitle", { selector: "h3" })
			).toBeInTheDocument()
		);
		expect(
			screen.getByText("Appeared On...", { selector: "button" })
		).toBeInTheDocument();
	});
});
