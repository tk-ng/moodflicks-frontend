import { render, screen } from "@testing-library/react";
import { RoutesList } from "./RoutesList";
import { MemoryRouter } from "react-router";
import { UserContext } from "../userComponents/UserContext";

describe("Render the RoutesList component", function () {
	it("renders logged out RoutesList without crashing ", function () {
		const { container, asFragment } = render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: null,
					}}
				>
					<RoutesList />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("renders logged in RoutesList without crashing ", function () {
		const { container, asFragment } = render(
			<MemoryRouter>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<RoutesList />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});
});

describe("Renders the proper page", function () {
	it("displays Homepage when url='/'", function () {
		render(
			<MemoryRouter initialEntries={["/"]}>
				<UserContext.Provider
					value={{
						currUser: null,
					}}
				>
					<RoutesList />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(screen.getByText("WELCOME TO MOODFLICKS!")).toBeInTheDocument();
	});

	it("displays Homepage when url='/moods/new' and user is logged out", function () {
		render(
			<MemoryRouter initialEntries={["/moods/new"]}>
				<UserContext.Provider
					value={{
						currUser: null,
					}}
				>
					<RoutesList />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(screen.getByText("WELCOME TO MOODFLICKS!")).toBeInTheDocument();
	});

	it("displays CreateMoodForm when url='/moods/new' and user is logged in", function () {
		render(
			<MemoryRouter initialEntries={["/moods/new"]}>
				<UserContext.Provider
					value={{
						currUser: { username: "testuser" },
					}}
				>
					<RoutesList />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(
			screen.getByText("Create", { selector: "button" })
		).toBeInTheDocument();
	});

	it("displays MoodList when url='/moods'", function () {
		render(
			<MemoryRouter initialEntries={["/moods"]}>
				<UserContext.Provider
					value={{
						currUser: null,
					}}
				>
					<RoutesList />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(
			screen.getByPlaceholderText("Search by mood...", { selector: "input" })
		).toBeInTheDocument();
	});

	it("displays MovieSearch when url='/movies'", function () {
		render(
			<MemoryRouter initialEntries={["/movies"]}>
				<UserContext.Provider
					value={{
						currUser: null,
					}}
				>
					<RoutesList />
				</UserContext.Provider>
			</MemoryRouter>
		);
		expect(
			screen.getByPlaceholderText("Search for a movie title...", {
				selector: "input",
			})
		).toBeInTheDocument();
	});
});
