import { render, screen, waitFor } from "@testing-library/react";
import { MoodSearch } from "./MoodSearch";
import { MemoryRouter, useSearchParams } from "react-router";
import { Api } from "../api/api";

vi.mock("../api/api", () => ({
	Api: {
		getMoods: vi.fn(),
		searchMood: vi.fn(),
	},
}));

vi.mock("react-router", async function () {
	const mod = await vi.importActual("react-router");
	return {
		...mod,
		useParams: vi.fn(),
		useSearchParams: vi.fn(),
	};
});

describe("Render MoodSearch component without keyword search", function () {
	it("mounts without crashing without moods", async function () {
		useSearchParams.mockReturnValue([new Map()]);
		Api.getMoods.mockReturnValue([]);
		const { container } = render(
			<MemoryRouter>
				<MoodSearch />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		await waitFor(() =>
			expect(screen.getByText("No moods found")).toBeInTheDocument()
		);
	});

	it("mounts without crashing with moods", async function () {
		useSearchParams.mockReturnValue([new Map()]);
		Api.getMoods.mockResolvedValue([
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
		const { container } = render(
			<MemoryRouter>
				<MoodSearch />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		await waitFor(() =>
			expect(screen.getByText("testmood-1")).toBeInTheDocument()
		);
	});
});

describe("Render MoodSearch component with keyword search", function () {
	it("mounts without crashing without moods", async function () {
		useSearchParams.mockReturnValue([new Map().set("keyword", "test keyword")]);
		Api.searchMood.mockReturnValue([]);
		const { container } = render(
			<MemoryRouter>
				<MoodSearch />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		await waitFor(() =>
			expect(screen.getByText("No moods found")).toBeInTheDocument()
		);
	});

	it("mounts without crashing with moods", async function () {
		useSearchParams.mockReturnValue([new Map().set("keyword", "testmood-2")]);
		Api.searchMood.mockReturnValue([
			{
				movies: ["testid5", "testid6", "testid7", "testid8", "testid9"],
				count: 5,
				mood: "testmood-2",
				id: "11",
				createdBy: "testuser1",
				totalVotes: "0",
			},
		]);
		const { container } = render(
			<MemoryRouter>
				<MoodSearch />
			</MemoryRouter>
		);
		expect(container).toBeInTheDocument();
		await waitFor(() =>
			expect(screen.getByText("testmood-2")).toBeInTheDocument()
		);
		expect(
			screen.getByText("created by: testuser1", { exact: false })
		).toBeInTheDocument();
	});
});
