import { render, screen } from "@testing-library/react";
import { CreateMoodForm } from "./CreateMoodForm";
import { UserContext } from "../userComponents/UserContext";
import { MemoryRouter } from "react-router";

describe("Render CreateMoodForm component", function () {
	it("mounts without crashing", function () {
		const { container } = render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<CreateMoodForm />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
	});

	it("shows the current user's username in the Created By field", async function () {
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<CreateMoodForm />
				</UserContext.Provider>
			</MemoryRouter>
		);

		const createdByField = screen.getByLabelText("Created By");
		expect(createdByField).toBeInTheDocument();
		expect(createdByField).toHaveValue("testuser");
	});
});
