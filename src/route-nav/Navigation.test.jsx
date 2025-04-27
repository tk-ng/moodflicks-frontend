import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Navigation } from "./Navigation";
import { UserContext } from "../userComponents/UserContext";

describe("Renders the Navigation component", function () {
	const logout = vi.fn();
	it("renders without crashing", function () {
		const { container, asFragment } = render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<Navigation logout={logout} />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
		screen.debug();
	});

	it("renders the logged in navbar", function () {
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<Navigation logout={logout} />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(
			screen.getByText("Create Mood", { selector: "a" })
		).toBeInTheDocument();
		expect(screen.getByText("Profile", { selector: "a" })).toBeInTheDocument();
		expect(screen.getByText("Log out", { selector: "a" })).toBeInTheDocument();
		expect(
			screen.queryByText("Sign Up", { selector: "a" })
		).not.toBeInTheDocument();
		expect(
			screen.queryByText("Login", { selector: "a" })
		).not.toBeInTheDocument();
	});

	it("matches snapshot when logged out", function () {
		const { asFragment } = render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: null,
					}}
				>
					<Navigation logout={logout} />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("renders the logged out navbar", function () {
		render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: null,
					}}
				>
					<Navigation logout={logout} />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(
			screen.queryByText("Create Mood", { selector: "a" })
		).not.toBeInTheDocument();
		expect(
			screen.queryByText("Profile", { selector: "a" })
		).not.toBeInTheDocument();
		expect(
			screen.queryByText("Log out", { selector: "a" })
		).not.toBeInTheDocument();
		expect(screen.getByText("Sign Up", { selector: "a" })).toBeInTheDocument();
		expect(screen.getByText("Login", { selector: "a" })).toBeInTheDocument();
	});
});
