import { render, screen, waitFor } from "@testing-library/react";
import { Api } from "../api/api";
import { MovieDetailCard } from "./MovieDetailCard";
import { MemoryRouter, useParams } from "react-router";
import { UserContext } from "../userComponents/UserContext";
import userEvent from "@testing-library/user-event";

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
	poster_path: "testMoviePosterPath",
};

const testCredits = {
	director: "testMovieDirector",
	cast: ["cast1", "cast2", "cast3"],
};

const testCurrUserMoods = [
	{
		movies: ["testid1", "testid2", "testid3", "testid4"],
		count: 4,
		mood: "testmood-1",
		id: "8",
		createdBy: "testuser2",
		totalVotes: "2",
	},
	{
		movies: ["testid5", "testid6", "testid7", "testid8", "testid9"],
		count: 5,
		mood: "testmood-2",
		id: "11",
		createdBy: "testuser1",
		totalVotes: "0",
	},
];

Api.getMovieDetail.mockResolvedValue(testMovie);

describe("Render the MovieDetailCard component", function () {
	useParams.mockReturnValue({ id: "testMovieId" });
	it("mounts without crashing", async function () {
		const { container, asFragment } = render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: null,
						currUserMoods: [],
					}}
				>
					<MovieDetailCard movie={testMovie} credits={testCredits} />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment).toMatchSnapshot();
	});

	it("renders the proper movie's detail for logged in user", async function () {
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
						currUserMoods: testCurrUserMoods,
					}}
				>
					<MovieDetailCard movie={testMovie} credits={testCredits} />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(
			screen.getByText(`Director: ${testCredits.director}`, { exact: false })
		).toBeInTheDocument();
		expect(
			screen.getByText(
				`Main cast: ${testCredits.cast[0]}, ${testCredits.cast[1]}, ${testCredits.cast[2]}`,
				{ exact: false }
			)
		).toBeInTheDocument();
		expect(
			screen.getByText(`Genres: ${testMovie.genres[0].name}`, { exact: false })
		).toBeInTheDocument();
		expect(screen.getByText(testMovie.overview)).toBeInTheDocument();

		// Logged in user should see the Add to my list button
		expect(screen.getByText("Add to my list")).toBeInTheDocument();
	});

	it("The Add to my list dropdown shows the user's moods", async function () {
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
						currUserMoods: testCurrUserMoods,
					}}
				>
					<MovieDetailCard movie={testMovie} credits={testCredits} />
				</UserContext.Provider>
			</MemoryRouter>
		);
		const user = userEvent.setup();
		const AddToBtn = screen.getByText("Add to my list");
		await waitFor(() => expect(AddToBtn).toBeInTheDocument());
		await user.click(AddToBtn);

		// The user's mood should be displayed
		expect(screen.getByText("Pick a mood list")).toBeVisible();
		testCurrUserMoods.forEach((mood) =>
			expect(screen.getByText(mood.mood)).toBeVisible()
		);
	});

	it("renders the proper movie's detail for logged out user", async function () {
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: null,
						currUserMoods: [],
					}}
				>
					<MovieDetailCard movie={testMovie} credits={testCredits} />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(
			screen.getByText(`Director: ${testCredits.director}`, { exact: false })
		).toBeInTheDocument();
		expect(
			screen.getByText(
				`Main cast: ${testCredits.cast[0]}, ${testCredits.cast[1]}, ${testCredits.cast[2]}`,
				{ exact: false }
			)
		).toBeInTheDocument();
		expect(
			screen.getByText(`Genres: ${testMovie.genres[0].name}`, { exact: false })
		).toBeInTheDocument();
		expect(screen.getByText(testMovie.overview)).toBeInTheDocument();

		// Logged out user should NOT see the Add to my list button
		expect(screen.queryByText("Add to my list")).not.toBeInTheDocument();
	});
});
