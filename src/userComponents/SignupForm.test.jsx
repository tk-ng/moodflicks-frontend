import { SignupForm } from "./SignupForm";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";

const signup = vi.fn();

describe("Render the SignupForm component", function () {
	it("mounts without crashing", async function () {
		const { container, asFragment } = render(
			<MemoryRouter>
				<SignupForm />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("renders the SignupForm properly", async function () {
		render(
			<MemoryRouter>
				<SignupForm />
			</MemoryRouter>
		);
		expect(screen.getByLabelText("Username")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(screen.getByLabelText("First Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(
			screen.getByText("Submit", { selector: "button" })
		).toBeInTheDocument();
	});
});

describe("Submit the SignupForm", function () {
	it("submits the form data properly", async function () {
		const login = vi.fn();
		render(
			<MemoryRouter>
				<SignupForm signup={signup} />
			</MemoryRouter>
		);
		const user = userEvent.setup();
		await user.type(screen.getByLabelText("Username"), "testuser1");
		await user.type(screen.getByLabelText("Password"), "testpassword");
		await user.type(screen.getByLabelText("First Name"), "U1F");
		await user.type(screen.getByLabelText("Last Name"), "U1L");
		await user.type(screen.getByLabelText("Email"), "test@test.com");
		await user.click(screen.getByText("Submit", { selector: "button" }));
		expect(signup).toHaveBeenCalledWith({
			username: "testuser1",
			password: "testpassword",
			firstName: "U1F",
			lastName: "U1L",
			email: "test@test.com",
		});
	});
});
