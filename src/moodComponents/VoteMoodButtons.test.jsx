import { render, screen, waitFor } from "@testing-library/react";
import { VoteMoodButtons } from "./VoteMoodButtons";
import { UserContext } from "../userComponents/UserContext";
import { MemoryRouter } from "react-router";
import { Api } from "../api/api";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";

vi.mock("../api/api", () => ({
	Api: {
		voteMood: vi.fn(),
		getMood: vi.fn(),
		getMoods: vi.fn(),
		searchMood: vi.fn(),
	},
}));

describe("Render VoteMoodButtons component", function () {
	it("matches snapshot", function () {
		const { asFragment } = render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<VoteMoodButtons />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(asFragment()).toMatchSnapshot();
	});
	it("mounts without crashing without moods", async function () {
		const { container } = render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<VoteMoodButtons />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
	});
});

describe("Handle VoteMoodButtons onClick", function () {
	it("clicks the thumbs up button", async function () {
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<VoteMoodButtons moodId={"testMood"} setMood={vi.fn()} />
				</UserContext.Provider>
			</MemoryRouter>
		);
		const user = userEvent.setup();
		await user.click(screen.getByText("👍"));
		expect(Api.voteMood).toHaveBeenCalledWith({
			moodId: "testMood",
			voteType: "up",
			username: "testuser",
		});
		expect(Api.getMood).toHaveBeenCalledWith("testMood");
	});

	it("clicks the thumbs down button", async function () {
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<VoteMoodButtons moodId={"testMood"} setMood={vi.fn()} />
				</UserContext.Provider>
			</MemoryRouter>
		);
		const user = userEvent.setup();
		await user.click(screen.getByText("👎"));
		expect(Api.voteMood).toHaveBeenCalledWith({
			moodId: "testMood",
			voteType: "down",
			username: "testuser",
		});
		expect(Api.getMood).toHaveBeenCalledWith("testMood");
	});
});
