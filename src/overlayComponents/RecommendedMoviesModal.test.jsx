import { render, screen, waitFor } from "@testing-library/react";
import { RecommendedMoviesModal } from "./RecommendedMoviesModal";
import { MemoryRouter } from "react-router";
import { PosterBaseUrl } from "../config";

describe("Render the RecommendedMoviesModal component", function () {
	const toggle = vi.fn();
	const testMovies = [
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
			overview: "Test Movie 1 Overview.",
			poll: 1,
		},
	];
	it("mounts without crashing", async function () {
		const { container, asFragment } = render(
			<RecommendedMoviesModal modal={true} toggle={toggle} recMovies={[]} />
		);
		expect(container).toBeInTheDocument();
		expect(asFragment).toMatchSnapshot();
	});

	it("renders with movies", async function () {
		render(
			<MemoryRouter>
				<RecommendedMoviesModal
					modal={true}
					toggle={toggle}
					recMovies={testMovies}
				/>
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

	// Without movies the "More Movies Like This" is not displayed. Tested in MoodDetail.test.jsx
});
