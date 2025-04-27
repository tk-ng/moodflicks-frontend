import "./AppearedOnOffcanvas.css";
import { MoodList } from "../moodComponents/MoodList";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";

export const SimilarMoodOffcanvas = ({ canvas, toggle, moods }) => {
	return (
		<div>
			<Offcanvas
				direction="bottom"
				toggle={toggle}
				isOpen={canvas}
				scrollable={true}
				backdrop
			>
				<OffcanvasHeader toggle={toggle}>
					The following moods have similar vibes to this mood list:
				</OffcanvasHeader>
				<OffcanvasBody>
					<MoodList moods={moods} />
				</OffcanvasBody>
			</Offcanvas>
		</div>
	);
};
