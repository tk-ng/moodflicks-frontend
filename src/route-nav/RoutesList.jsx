import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router";
import { MovieDetail } from "../movieComponents/MovieDetail";
import { Homepage } from "../Homepage";
import { LoginForm } from "../userComponents/LoginForm";
import { SignupForm } from "../userComponents/SignupForm";
import { ProfileForm } from "../userComponents/ProfileForm";
import { MovieSearch } from "../movieComponents/MovieSearch";
import { MoodSearch } from "../moodComponents/MoodSearch";
import { MoodDetail } from "../moodComponents/MoodDetail";
import { UserContext } from "../userComponents/UserContext";
import { ProfilePage } from "../userComponents/ProfilePage";
import { EditMoodForm } from "../moodComponents/EditMoodForm";
import { CreateMoodForm } from "../moodComponents/CreateMoodForm";

export const RoutesList = ({ login, signup }) => {
	const { currUser } = useContext(UserContext);
	return (
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route path="/movies" element={<MovieSearch />} />
			<Route path="/movies/:id" element={<MovieDetail />} />
			<Route path="/moods" element={<MoodSearch />} />
			<Route path="/moods/:id" element={<MoodDetail />} />
			<Route path="/users/:username" element={<ProfilePage />} />

			{currUser ? (
				<>
					<Route path="/users/:username/edit" element={<ProfileForm />} />
					<Route path="/moods/:id/edit" element={<EditMoodForm />} />
					<Route path="/moods/new" element={<CreateMoodForm />} />
				</>
			) : (
				<>
					<Route path="/login" element={<LoginForm login={login} />} />
					<Route path="/signup" element={<SignupForm signup={signup} />} />
				</>
			)}
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
};
