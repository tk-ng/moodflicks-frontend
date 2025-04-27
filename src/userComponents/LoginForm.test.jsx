import { render, screen } from "@testing-library/react";
import { LoginForm } from "./LoginForm";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";

describe("Render the LoginForm component", function () {
	it("mounts without crashing", async function () {
		const { container, asFragment } = render(
			<MemoryRouter>
				<LoginForm />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("renders the LoginForm properly", async function () {
		render(
			<MemoryRouter>
				<LoginForm />
			</MemoryRouter>
		);
		expect(screen.getByLabelText("Username")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(
			screen.getByText("Submit", { selector: "button" })
		).toBeInTheDocument();
	});
});

describe("Submit the LoginForm", function () {
	it("submits the form data properly", async function () {
		const login = vi.fn();
		render(
			<MemoryRouter>
				<LoginForm login={login} />
			</MemoryRouter>
		);
		const user = userEvent.setup();
		await user.type(screen.getByLabelText("Username"), "testuser1");
		await user.type(screen.getByLabelText("Password"), "testpassword");
		await user.click(screen.getByText("Submit", { selector: "button" }));
		expect(login).toHaveBeenCalledWith({
			username: "testuser1",
			password: "testpassword",
		});
	});
});
