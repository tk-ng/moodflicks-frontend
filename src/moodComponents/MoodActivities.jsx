import { Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router";

export const MoodActivities = ({ activities }) => {
	return (
		<Row>
			<Col xs="0" md="2" lg="3"></Col>
			<Col>
				<ListGroup>
					{activities.map((m) => {
						const key = m.moodID + m.movieID;
						return (
							<ListGroupItem
								key={key}
								color="danger"
								tag={Link}
								to={`/moods/${m.moodID}`}
							>
								<div className="text-dark">
									{m.createdBy} added a movie to their mood list "{m.mood}"{" "}
									{m.createdAgo}.
								</div>
							</ListGroupItem>
						);
					})}
				</ListGroup>
			</Col>
			<Col xs="0" md="2" lg="3"></Col>
		</Row>
	);
};
