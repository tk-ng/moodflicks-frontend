import { render, screen } from "@testing-library/react";
import { AppearedOnOffcanvas } from "./AppearedOnOffcanvas";
import { MemoryRouter } from "react-router";

describe("Render the AppearedOnOffcanvas component", function () {
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
			<AppearedOnOffcanvas canvas={true} toggle={toggle} moods={[]} />
		);
		expect(container).toBeInTheDocument();
		expect(asFragment).toMatchSnapshot();
	});

	it("renders without moods", async function () {
		render(<AppearedOnOffcanvas canvas={true} toggle={toggle} moods={[]} />);
		expect(
			screen.getByText("This movie is not on any list. Be the first to add it!")
		).toBeInTheDocument();
	});

	it("renders with moods", async function () {
		render(
			<MemoryRouter>
				<AppearedOnOffcanvas canvas={true} toggle={toggle} moods={testMoods} />
			</MemoryRouter>
		);
		expect(screen.getByText("testmood-1")).toBeInTheDocument();
		expect(screen.getByText("testmood-2")).toBeInTheDocument();
	});
});
