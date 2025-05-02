import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { RoutesList } from "./route-nav/RoutesList";
import { Navigation } from "./route-nav/Navigation";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { UserContext } from "./userComponents/UserContext";
import { Api } from "./api/api";
import * as jwt from "jsonwebtoken-esm";
import { ToastContainer, Slide, toast } from "react-toastify";

function App() {
	const [currentUser, setCurrentUser] = useState({
		infoLoaded: false,
		data: null,
	});
	const [token, setToken] = useLocalStorage("moodflicks-token");
	const [currUserMoods, setCurrUserMoods] = useState([]);

	async function logout() {
		setCurrentUser({
			infoLoaded: false,
			data: null,
		});
		setToken(null);
		toast.success("Logged out successfully");
	}

	async function login(loginData) {
		const token = await Api.login(loginData);
		setToken(token);
	}

	async function signup(signupData) {
		const token = await Api.signup(signupData);
		setToken(token);
	}

	async function createMood(mood) {
		const newMood = await Api.createMood({
			mood,
			username: currentUser.data.username,
		});
		setCurrUserMoods((currUserMoods) => [...currUserMoods, newMood]);
		return newMood.id;
	}

	useEffect(() => {
		async function getCurrentUser() {
			if (token) {
				try {
					let { username } = jwt.decode(token);
					Api.token = token;
					let currentUser = await Api.getUser(username);
					let currentUserMoods = await Api.getMoodsByUser(username);

					setCurrentUser({
						infoLoaded: true,
						data: currentUser,
					});
					setCurrUserMoods(currentUserMoods);
				} catch (err) {
					console.error(err);
					setCurrentUser({
						infoLoaded: true,
						data: null,
					});
				}
			} else {
				setCurrentUser({
					infoLoaded: true,
					data: null,
				});
			}
		}
		getCurrentUser();
	}, [token]);

	if (!currentUser.infoLoaded) return <div>Loading ...</div>;

	return (
		<UserContext.Provider
			value={{
				currUser: currentUser.data,
				setCurrentUser,
				currUserMoods,
				createMood,
				setCurrUserMoods,
			}}
		>
			<ToastContainer
				hideProgressBar
				autoClose={3000}
				position="top-center"
				transition={Slide}
			/>
			<Navigation logout={logout} />
			<RoutesList login={login} signup={signup} />
		</UserContext.Provider>
	);
}

export default App;
