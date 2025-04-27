import { render, screen, waitFor } from "@testing-library/react";
import { MoodList } from "./MoodList";
import { MemoryRouter } from "react-router";

describe("Render MoodList component", function () {
	it("mounts without crashing", function () {
		const { container } = render(
			<MemoryRouter>
				<MoodList moods={[]} />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
	});

	it("displays the moods in list items", function () {
		render(
			<MemoryRouter>
				<MoodList
					moods={[
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
					]}
				/>
			</MemoryRouter>
		);
		expect(screen.getByText("testmood-2")).toBeInTheDocument();
		expect(
			screen.getByText("created by: testuser1", { exact: false })
		).toBeInTheDocument();
		expect(
			screen.getByText("created by: testuser2", { exact: false })
		).toBeInTheDocument();
		screen
			.getAllByText("score:", {
				exact: false,
				selector: "span",
			})
			.forEach((el) => expect(el).toBeInTheDocument());
	});
});
