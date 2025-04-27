import { useState, useEffect } from "react";
import { Api } from "./api/api";
import { MoodActivities } from "./moodComponents/MoodActivities";

export const Homepage = () => {
	const [activities, setActivities] = useState([]);

	async function getActivities() {
		try {
			const result = await Api.getActivities();
			setActivities(result);
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		getActivities();
	}, []);

	return (
		<div className="Homepage p-5">
			<h1 className="Homepage-title pb-5">WELCOME TO MOODFLICKS!</h1>
			<h2>Discover movies that match your mood.</h2>
			{activities.length ? (
				<MoodActivities activities={activities} />
			) : (
				<p>Sorry, no results were found!</p>
			)}
			<div className="container mt-5">
				With MoodFlicks, you create personalized mood-based movie lists, explore
				curated vibes from other users, and get unique recommendations based on
				shared emotional themes—so you’re never stuck scrolling again. Whether
				you’re in the mood to laugh, cry, think, or chill—MoodFlicks gets it.
			</div>
			<div>Start building your vibe today.</div>
		</div>
	);
};
