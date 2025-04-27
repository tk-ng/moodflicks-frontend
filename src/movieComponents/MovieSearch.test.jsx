import { render, screen, waitFor } from "@testing-library/react";
import { MovieSearch } from "./MovieSearch";
import { MemoryRouter, useSearchParams } from "react-router";
import { Api } from "../api/api";
import { PosterBaseUrl } from "../config";

vi.mock("../api/api", () => ({
	Api: {
		getTrendingMovies: vi.fn(),
		searchMovie: vi.fn(),
	},
}));

vi.mock("react-router", async function () {
	const mod = await vi.importActual("react-router");
	return {
		...mod,
		useSearchParams: vi.fn(),
	};
});

describe("Render MovieSearch component without keyword search", function () {
	it("mounts trending movies without crashing (without movies)", async function () {
		useSearchParams.mockReturnValue([new Map()]);
		Api.getTrendingMovies.mockReturnValue([]);
		const { container, asFragment } = render(
			<MemoryRouter>
				<MovieSearch />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment).toMatchSnapshot();
		await waitFor(() =>
			expect(screen.getByText("No movies found")).toBeInTheDocument()
		);
	});

	it("mounts trending movies without crashing (with movies)", async function () {
		useSearchParams.mockReturnValue([new Map()]);
		Api.getTrendingMovies.mockReturnValue([
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
		render(
			<MemoryRouter>
				<MovieSearch />
			</MemoryRouter>
		);
		await waitFor(() =>
			expect(
				screen.getByText("Test Movie 1", { selector: "h5" })
			).toBeInTheDocument()
		);
		screen
			.getAllByAltText("Movie Poster")
			.forEach((el, idx) =>
				expect(el).toHaveAttribute(
					"src",
					PosterBaseUrl + "w185" + `/testposter${idx + 1}.jpg`
				)
			);
	});
});
describe("Render MovieSearch component with keyword search", function () {
	it("mounts trending movies without crashing (without movies)", async function () {
		useSearchParams.mockReturnValue([
			new Map().set("keyword", "testkeywordnoresult"),
		]);
		Api.searchMovie.mockReturnValue([]);
		const { container, asFragment } = render(
			<MemoryRouter>
				<MovieSearch />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment).toMatchSnapshot();
		await waitFor(() =>
			expect(screen.getByText("No movies found")).toBeInTheDocument()
		);
	});

	it("mounts trending movies without crashing (with movies)", async function () {
		useSearchParams.mockReturnValue([new Map().set("keyword", "Test Movie")]);
		Api.searchMovie.mockReturnValue([
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
		render(
			<MemoryRouter>
				<MovieSearch />
			</MemoryRouter>
		);
		await waitFor(() =>
			expect(
				screen.getByText("Test Movie 1", { selector: "h5" })
			).toBeInTheDocument()
		);
		screen
			.getAllByAltText("Movie Poster")
			.forEach((el, idx) =>
				expect(el).toHaveAttribute(
					"src",
					PosterBaseUrl + "w185" + `/testposter${idx + 1}.jpg`
				)
			);
	});
});
