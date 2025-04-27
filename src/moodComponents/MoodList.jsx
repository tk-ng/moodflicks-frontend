import { Link } from "react-router";
import {
	Badge,
	ListGroup,
	ListGroupItem,
	ListGroupItemHeading,
	ListGroupItemText,
	Row,
	Col,
} from "reactstrap";

export const MoodList = ({ moods, hideCreatedBy = false }) => {
	return (
		<Row className="MoodList mb-3">
			<Col xs="1" md="1"></Col>
			<Col>
				<ListGroup className="d-flex align-items-center">
					{moods.map((m) => {
						return (
							<ListGroupItem
								action
								key={m.id}
								color="secondary"
								className="mb-1 p-3"
							>
								<Link
									to={`/moods/${m.id}`}
									key={m.id}
									className="d-flex justify-content-between"
								>
									<div className="d-flex nowrap">
										<ListGroupItemHeading className="text-truncate">
											{m.mood}
										</ListGroupItemHeading>
										<div className="ms-2">
											<Badge pill>score: {m.totalVotes}</Badge>{" "}
											<Badge pill>
												{m.count} {m.count > 1 ? "movies" : "movie"}
											</Badge>
										</div>
									</div>

									<ListGroupItemText>
										{!hideCreatedBy && <>created by: {m.createdBy}</>}
									</ListGroupItemText>
								</Link>
							</ListGroupItem>
						);
					})}
				</ListGroup>
			</Col>
			<Col xs="1" md="1"></Col>
		</Row>
	);
};
