import { render, screen, waitFor } from "@testing-library/react";
import { Api } from "../api/api";
import { ProfilePage } from "./ProfilePage";
import { useParams, MemoryRouter } from "react-router";
import { UserContext } from "./UserContext";

vi.mock("../api/api", () => ({
	Api: {
		getUser: vi.fn(),
		getMoodsByUser: vi.fn(),
	},
}));

vi.mock("react-router", async function () {
	const mod = await vi.importActual("react-router");
	return {
		...mod,
		useParams: vi.fn(),
	};
});

describe("Renders the ProfilePage component", function () {
	useParams.mockReturnValue({ username: "testuser" });
	it("mounts without crashing", async function () {
		const { container, asFragment } = render(
			<MemoryRouter>
				<UserContext.Provider value={{ currUser: null }}>
					<ProfilePage />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});
});

describe("Display/Hide Edit Profile button based on logged in status", function () {
	Api.getUser.mockResolvedValue({
		username: "testuser",
		firstName: "U1F",
		lastName: "U1L",
		email: "testuser@test.com",
		isAdmin: false,
	});
	Api.getMoodsByUser.mockResolvedValue([
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
	]);

	it("renders the ProfilePage properly for profile user", async function () {
		render(
			<MemoryRouter>
				<UserContext.Provider value={{ currUser: { username: "testuser" } }}>
					<ProfilePage />
				</UserContext.Provider>
			</MemoryRouter>
		);
		await waitFor(() =>
			expect(
				screen.getByText("Edit Profile", { selector: "button" })
			).toBeInTheDocument()
		);
		expect(screen.getByText("testmood-1")).toBeInTheDocument();
		expect(screen.getByText("testmood-2")).toBeInTheDocument();

		// moodlists on a user's profile page should not include the "created by: " text
		expect(
			screen.queryByText("created by: testuser1", { exact: false })
		).not.toBeInTheDocument();
		expect(
			screen.queryByText("created by: testuser2", { exact: false })
		).not.toBeInTheDocument();
	});

	it("renders the ProfilePage properly for non-profile user", async function () {
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{ currUser: { username: "noProfileUser" } }}
				>
					<ProfilePage />
				</UserContext.Provider>
			</MemoryRouter>
		);
		await waitFor(() =>
			expect(screen.getByText("testmood-1")).toBeInTheDocument()
		);

		expect(
			screen.queryByText("Edit Profile", { selector: "button" })
		).not.toBeInTheDocument();
	});

	it("renders the ProfilePage properly for anon user", async function () {
		render(
			<MemoryRouter>
				<UserContext.Provider value={{ currUser: null }}>
					<ProfilePage />
				</UserContext.Provider>
			</MemoryRouter>
		);
		await waitFor(() =>
			expect(screen.getByText("testmood-1")).toBeInTheDocument()
		);

		expect(
			screen.queryByText("Edit Profile", { selector: "button" })
		).not.toBeInTheDocument();
	});
});
