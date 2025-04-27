import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "./App";

it("renders without crashing", function () {
	render(
		<MemoryRouter>
			<App />
		</MemoryRouter>
	);
});
