import { render, screen, waitFor } from "@testing-library/react";
import { MoodDetail } from "./MoodDetail";
import { UserContext } from "../userComponents/UserContext";
import { useParams, MemoryRouter } from "react-router";
import { Api } from "../api/api";

vi.mock("../api/api", () => ({
	Api: {
		getMood: vi.fn().mockResolvedValue({
			id: "8",
			mood: "Test Mood",
			createdBy: "testuser",
		}),
		getMoviesByMood: vi.fn().mockResolvedValue([]),
		getRecommendedMoviesByMood: vi.fn().mockResolvedValue([]),
		getSimilarMoods: vi.fn().mockResolvedValue([]),
	},
}));

vi.mock("react-router", async function () {
	const mod = await vi.importActual("react-router");
	return {
		...mod,
		useParams: vi.fn(),
	};
});

describe("Render MoodDetail component", function () {
	it("mounts without crashing", function () {
		useParams.mockReturnValue({ id: "8" });
		const { container } = render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<MoodDetail />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
	});

	it("The Edit Mood button is displayed if logged in as mood owner", async function () {
		useParams.mockReturnValue({ id: "8" });
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<MoodDetail />
				</UserContext.Provider>
			</MemoryRouter>
		);

		// Test if the 'Edit Mood' button is displayed if logged in as mood owner
		await waitFor(() => {
			expect(
				screen.getByText("Edit Mood", {
					selector: "a",
				})
			).toBeInTheDocument();
		});

		const addMoviesLink = screen.getByText("Start adding movies", {
			selector: "a",
		});
		expect(addMoviesLink).toBeInTheDocument();
	});

	it("The Edit Mood button is displayed if logged in as an admin", async function () {
		useParams.mockReturnValue({ id: "8" });
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "admin", isAdmin: true },
					}}
				>
					<MoodDetail />
				</UserContext.Provider>
			</MemoryRouter>
		);

		// Test if the 'Edit Mood' button is displayed if logged in as an admin
		await waitFor(() => {
			expect(
				screen.getByText("Edit Mood", {
					selector: "a",
				})
			).toBeInTheDocument();
		});

		const addMoviesLink = screen.getByText("Start adding movies", {
			selector: "a",
		});
		expect(addMoviesLink).toBeInTheDocument();
	});

	it("The Edit Mood button is NOT displayed if logged in as non-owner/non-admin", async function () {
		useParams.mockReturnValue({ id: "8" });
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "non-owner", isAdmin: false },
					}}
				>
					<MoodDetail />
				</UserContext.Provider>
			</MemoryRouter>
		);

		// Test if the 'Edit Mood' button is NOT displayed if not logged in as an admin/mood owner
		await waitFor(() => {
			expect(screen.getByText("Test Mood")).toBeInTheDocument();
		});
		expect(
			screen.queryByText("Edit Mood", {
				selector: "a",
			})
		).not.toBeInTheDocument();
		const addMoviesLink = screen.queryByText("Start adding movies", {
			selector: "a",
		});
		expect(addMoviesLink).not.toBeInTheDocument();
	});
});

describe("Similar Moods and More Movies Like This buttons", function () {
	it("should hide the buttons if no similar moods or recommend movies are returned", async function () {
		useParams.mockReturnValue({ id: "8" });
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: {},
					}}
				>
					<MoodDetail />
				</UserContext.Provider>
			</MemoryRouter>
		);
		await waitFor(() => {
			expect(screen.getByText("Test Mood")).toBeInTheDocument();
		});
		expect(screen.queryByText("More Movies Like This")).not.toBeInTheDocument();
		expect(screen.queryByText("Similar Moods")).not.toBeInTheDocument();
	});

	it("shows the similar moods and recommended movies buttons", async function () {
		Api.getMoviesByMood.mockResolvedValue([
			{
				id: "testid1",
				posterPath: "/testposter1.jpg",
				title: "Test Movie 1",
				releaseDate: "2025-02-28",
				overview: "Test Movie 1 Overview.",
			},
			{
				id: "testid2",
				posterPath: "/testposter2.jpg",
				title: "Test Movie 2",
				releaseDate: "2025-02-28",
				overview: "Test Movie 2 Overview.",
			},
		]);
		Api.getRecommendedMoviesByMood.mockResolvedValue([
			{
				id: "testid1",
				posterPath: "/testposter1.jpg",
				title: "Test Movie 1",
				releaseDate: "2025-02-28",
				overview: "Test Movie 1 Overview.",
				poll: 1,
			},
			{
				id: "testid2",
				posterPath: "/testposter2.jpg",
				title: "G20",
				releaseDate: "Test Movie 2",
				overview: "Test Movie 2 Overview.",
				poll: 1,
			},
		]);
		Api.getSimilarMoods.mockResolvedValue([
			{
				movies: ["testid1", "testid2", "testid3", "testid4"],
				count: 4,
				mood: "testmood2",
				id: "8",
				createdBy: "testuser2",
				totalVotes: "1",
			},
		]);

		useParams.mockReturnValue({ id: "8" });
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: {},
					}}
				>
					<MoodDetail />
				</UserContext.Provider>
			</MemoryRouter>
		);
		await waitFor(() => {
			expect(screen.getByText("More Movies Like This")).toBeInTheDocument();
		});
		expect(screen.getByText("Similar Moods")).toBeInTheDocument();
	});
});
