import { render, screen } from "@testing-library/react";
import { MoodActivities } from "./MoodActivities";
import { MemoryRouter } from "react-router";
import { describe, expect } from "vitest";

const testActivities = [
	{
		movieID: 1111111,
		moodID: "01",
		mood: "Test Mood 1",
		createdBy: "testuser1",
		createdAgo: "3 days ago",
	},
	{
		movieID: 2222222,
		moodID: "02",
		mood: "Test Mood 2",
		createdBy: "testuser2",
		createdAgo: "5 days ago",
	},
	{
		movieID: 3333333,
		moodID: "03",
		mood: "Test Mood 3",
		createdBy: "testuser3",
		createdAgo: "7 days ago",
	},
];

describe("Render the MoodActivities component", function () {
	it("mounts without crashing", async function () {
		const { container, asFragment } = render(
			<MemoryRouter>
				<MoodActivities activities={[]} />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment).toMatchSnapshot();
	});

	it("render the component with activities", async function () {
		render(
			<MemoryRouter>
				<MoodActivities activities={testActivities} />
			</MemoryRouter>
		);
		const screenText1 = `testuser1 added a movie to their mood list "Test Mood 1" 3 days ago`;
		expect(screen.getByText(screenText1, { exact: false })).toBeInTheDocument();
	});
});
