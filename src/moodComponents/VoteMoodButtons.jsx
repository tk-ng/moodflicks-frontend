import { Button } from "reactstrap";
import { Api } from "../api/api";
import { UserContext } from "../userComponents/UserContext";
import { useContext } from "react";

export const VoteMoodButtons = ({ moodId, setMood }) => {
	const { currUser } = useContext(UserContext);

	const handleClick = async (voteType) => {
		await Api.voteMood({ moodId, voteType, username: currUser.username });
		setMood(await Api.getMood(moodId));
	};

	return (
		<div className="d-flex justify-content-around">
			<Button color="primary" onClick={() => handleClick("up")}>
				👍
			</Button>
			<Button color="danger" onClick={() => handleClick("down")}>
				👎
			</Button>
		</div>
	);
};
