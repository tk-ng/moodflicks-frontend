import { render, screen } from "@testing-library/react";
import { SearchBar } from "./SearchBar";
import { MemoryRouter, useSearchParams } from "react-router";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";

const search = vi.fn();

vi.mock("react-router", async function () {
	const mod = await vi.importActual("react-router");
	return {
		...mod,
		useSearchParams: vi.fn(),
	};
});

describe("Renders the SearchBar component", function () {
	it("mounts without crashing", async function () {
		useSearchParams.mockReturnValue([new Map(), () => vi.fn()]);
		const { container, asFragment } = render(
			<MemoryRouter>
				<SearchBar search={search} />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		expect(asFragment).toMatchSnapshot();
	});

	it("submits with form data", async function () {
		const user = userEvent.setup();
		useSearchParams.mockReturnValue([new Map(), () => vi.fn()]);
		render(
			<MemoryRouter initialEntries={[""]}>
				<SearchBar search={search} />
			</MemoryRouter>
		);
		const searchBar = screen.getByPlaceholderText("Search", { exact: false });
		expect(searchBar).toBeInTheDocument();

		await user.type(searchBar, "testSearchBarInput");
		await user.click(screen.getByText("Search", { selector: "button" }));
		expect(search).toHaveBeenCalledWith("testSearchBarInput");
	});
});
