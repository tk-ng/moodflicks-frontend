import { Homepage } from "./Homepage";
import { render, screen } from "@testing-library/react";

vi.mock("../api/api", () => ({
	Api: {
		getActivities: vi.fn().mockResolvedValue([]),
	},
}));

describe("Renders the Homepage component", function () {
	it("mounts without crashing", async function () {
		const { container, asFragment } = render(<Homepage />);
		expect(container).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("renders properly without activities", async function () {
		render(<Homepage />);
		expect(
			screen.getByText("Sorry, no results were found!")
		).toBeInTheDocument();
	});

	// With activities is tested in MoodActivities.test.jsx
});
