import "./AppearedOnOffcanvas.css";
import { MoodList } from "../moodComponents/MoodList";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";

export const AppearedOnOffcanvas = ({ canvas, toggle, moods }) => {
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
					This movie has been added to the following mood list(s) by our users.
				</OffcanvasHeader>
				<OffcanvasBody>
					{moods.length > 0 ? (
						<MoodList moods={moods} />
					) : (
						<span className="text-light">
							This movie is not on any list. Be the first to add it!
						</span>
					)}
				</OffcanvasBody>
			</Offcanvas>
		</div>
	);
};
