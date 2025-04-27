import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Api } from "../api/api";
import { SearchBar } from "../SearchBar";
import { MoodList } from "./MoodList";
import "./MoodSearch.css";

export const MoodSearch = () => {
	const [moods, setMoods] = useState([]);
	const [searchParams] = useSearchParams();
	const keyword = searchParams.get("keyword") || "";

	async function getMoods() {
		try {
			const result = await Api.getMoods();
			setMoods(result);
		} catch (err) {
			console.error(err);
		}
	}

	async function moodSearch(keyword) {
		const moods = await Api.searchMood(keyword);
		setMoods(moods);
	}

	useEffect(() => {
		if (keyword && keyword.trim()) {
			moodSearch(keyword);
		} else {
			getMoods();
		}
	}, [keyword]);

	return (
		<div>
			<SearchBar search={moodSearch} />
			{moods.length ? <MoodList moods={moods} /> : <p>No moods found</p>}
		</div>
	);
};
