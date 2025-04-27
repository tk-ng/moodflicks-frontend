import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { MovieCardList } from "../movieComponents/MovieCardList";
import "./RecommendedMoviesModal.css";

export const RecommendedMoviesModal = ({ recMovies, modal, toggle }) => {
	return (
		<div>
			<Modal
				isOpen={modal}
				toggle={toggle}
				fullscreen="sm"
				size="xl"
				centered={true}
				scrollable={true}
				modalClassName="RecommendedMoviesModal"
			>
				<ModalHeader className="text-light">
					Similar Movies to Match This Mood
				</ModalHeader>
				<ModalBody>
					<div className="text-light mb-2">
						These films are frequently grouped with this list’s picks
					</div>
					<MovieCardList movies={recMovies} />
				</ModalBody>
				<ModalFooter>
					<Button color="dark" onClick={toggle}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};
