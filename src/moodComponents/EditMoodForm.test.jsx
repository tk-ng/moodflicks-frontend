import { render, screen, waitFor } from "@testing-library/react";
import { EditMoodForm } from "./EditMoodForm";
import { UserContext } from "../userComponents/UserContext";
import { useParams, MemoryRouter } from "react-router";
import { RoutesList } from "../route-nav/RoutesList";

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

describe("Render EditMoodForm component", function () {
	it("mounts without crashing", function () {
		useParams.mockReturnValue({ id: "8" });
		const { container } = render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<EditMoodForm />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
	});

	it("The Created By and Mood fields are filled by default", async function () {
		useParams.mockReturnValue({ id: "8" });
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<EditMoodForm />
				</UserContext.Provider>
			</MemoryRouter>
		);

		// Test if the 'Mood Name' & 'Created By' fields and 'Save Changes' &
		// 'Delete Mood' buttons are rendered
		const saveChangesBtn = screen.getByText("Save Changes", {
			selector: "button",
		});
		expect(saveChangesBtn).toBeInTheDocument();

		const deleteMoodBtn = screen.getByText("Delete Mood", {
			selector: "button",
		});
		expect(deleteMoodBtn).toBeInTheDocument();
		const moodNameField = screen.getByLabelText("Mood Name");
		expect(moodNameField).toBeInTheDocument();

		const createdByField = screen.getByLabelText("Created By");
		expect(createdByField).toBeInTheDocument();
		expect(createdByField).toBeDisabled();

		// Test if the fields are filled by default
		await waitFor(() => {
			expect(createdByField).toHaveValue("testuser");
			expect(moodNameField).toHaveValue("Test Mood");
		});
	});

	it("The page loads if the user is an admin", async function () {
		useParams.mockReturnValue({ id: "8" });
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "admin", isAdmin: true },
					}}
				>
					<EditMoodForm />
				</UserContext.Provider>
			</MemoryRouter>
		);

		// Test if the 'Mood Name' & 'Created By' fields and 'Save Changes' &
		// 'Delete Mood' buttons are rendered
		const saveChangesBtn = screen.getByText("Save Changes", {
			selector: "button",
		});
		expect(saveChangesBtn).toBeInTheDocument();

		const deleteMoodBtn = screen.getByText("Delete Mood", {
			selector: "button",
		});
		expect(deleteMoodBtn).toBeInTheDocument();
		const moodNameField = screen.getByLabelText("Mood Name");
		expect(moodNameField).toBeInTheDocument();

		const createdByField = screen.getByLabelText("Created By");
		expect(createdByField).toBeInTheDocument();
		expect(createdByField).toBeDisabled();

		// Test if the fields are filled by default
		await waitFor(() => {
			expect(createdByField).toHaveValue("testuser");
			expect(moodNameField).toHaveValue("Test Mood");
		});
	});

	it("It redirects the user if they are not the creator nor admin", async function () {
		useParams.mockReturnValue({ id: "8" });
		render(
			<MemoryRouter initialEntries={["/moods/8/edit"]}>
				<UserContext.Provider
					value={{
						currUser: { username: "nonowner", isAdmin: false },
					}}
				>
					<RoutesList />
				</UserContext.Provider>
			</MemoryRouter>
		);

		// Test if the user has been redirected to that mood's page
		await waitFor(() => {
			expect(
				screen.getByText("score:", {
					exact: false,
					selector: "span",
				})
			).toBeInTheDocument();
		});
		expect(
			screen.getByText("Test Mood", {
				selector: "span",
			})
		).toBeInTheDocument();
		expect(
			screen.getByText("testuser", {
				selector: "a",
			})
		).toBeInTheDocument();
	});
});
