import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { Navigate, useParams } from "react-router";
import { Api } from "../api/api";
import { Button } from "reactstrap";
import { useNavigate } from "react-router";
import { MoodList } from "../moodComponents/MoodList";
import { toast } from "react-toastify";

export const ProfilePage = () => {
	const params = useParams();
	const navigate = useNavigate();
	const [user, setUser] = useState();
	const [moods, setMoods] = useState([]);
	const { currUser } = useContext(UserContext);

	const [isLoading, setIsLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		async function getUserInfo(username) {
			try {
				setIsLoading(true);
				setNotFound(false);
				const [userResult, moodsResult] = await Promise.all([
					Api.getUser(username),
					Api.getMoodsByUser(username),
				]);
				setUser(userResult);
				setMoods(moodsResult);
			} catch (err) {
				console.error("User not found:", err);
				setNotFound(true);
			} finally {
				setIsLoading(false);
			}
		}

		getUserInfo(params.username);
	}, [params.username]);

	if (isLoading) return <p>Loading...</p>;
	if (notFound) {
		toast.warning(`username: ${params.username} could not be found.`);
		return <Navigate to="/" />;
	}

	return (
		<div className="text-light">
			<span className="display-6">{user.username}</span>
			{currUser && user.username === currUser.username && (
				<Button
					onClick={() => navigate(`/users/${user.username}/edit`)}
					className="m-3 "
				>
					Edit Profile
				</Button>
			)}
			<div>
				{moods.length ? (
					<>
						<h3> Mood-based movie lists, curated by {user.username}</h3>
						<MoodList moods={moods} hideCreatedBy={true} />
					</>
				) : (
					<span>{user.username} has not created any mood lists yet.</span>
				)}
			</div>
		</div>
	);
};
