import { render, screen, waitFor } from "@testing-library/react";
import { useParams, MemoryRouter } from "react-router";
import { ProfileForm } from "./ProfileForm";
import { UserContext } from "./UserContext";
import { Api } from "../api/api";

vi.mock("../api/api", () => ({
	Api: {
		getUser: vi.fn(),
		saveChanges: vi.fn(),
	},
}));

vi.mock("react-router", async function () {
	const mod = await vi.importActual("react-router");
	return {
		...mod,
		useParams: vi.fn(),
	};
});

describe("Render the ProfileForm component", function () {
	useParams.mockReturnValue({ username: "testuser" });
	it("mounts without crashing", async function () {
		const { container, asFragment } = render(
			<MemoryRouter>
				<UserContext.Provider value={{ currUser: null }}>
					<ProfileForm />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("renders properly for logged in user", async function () {
		Api.getUser.mockResolvedValue({
			username: "testuser",
			firstName: "U1F",
			lastName: "U1L",
			email: "testuser@test.com",
			isAdmin: false,
		});
		render(
			<MemoryRouter>
				<UserContext.Provider value={{ currUser: { username: "testuser" } }}>
					<ProfileForm />
				</UserContext.Provider>
			</MemoryRouter>
		);
		await waitFor(() =>
			expect(screen.getByLabelText("Username")).toHaveValue("testuser")
		);
		expect(screen.getByLabelText("First Name")).toHaveValue("U1F");
		expect(screen.getByLabelText("Last Name")).toHaveValue("U1L");
		expect(screen.getByLabelText("Email")).toHaveValue("testuser@test.com");
	});
});
