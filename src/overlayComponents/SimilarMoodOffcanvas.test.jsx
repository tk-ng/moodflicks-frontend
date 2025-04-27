import { render, screen } from "@testing-library/react";
import { SimilarMoodOffcanvas } from "./SimilarMoodOffcanvas";
import { MemoryRouter } from "react-router";

describe("Render the SimilarMoodOffcanvas component", function () {
	const toggle = vi.fn();
	const testMoods = [
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
	it("mounts without crashing", async function () {
		const { container, asFragment } = render(
			<SimilarMoodOffcanvas canvas={true} toggle={toggle} moods={[]} />
		);
		expect(container).toBeInTheDocument();
		expect(asFragment).toMatchSnapshot();
	});

	it("renders with moods", async function () {
		render(
			<MemoryRouter>
				<SimilarMoodOffcanvas canvas={true} toggle={toggle} moods={testMoods} />
			</MemoryRouter>
		);
		expect(screen.getByText("testmood-1")).toBeInTheDocument();
		expect(screen.getByText("testmood-2")).toBeInTheDocument();
	});

	// Without similar moods the "Similar Moods" button is not displayed. Tested in MoodDetail.test.jsx
});
