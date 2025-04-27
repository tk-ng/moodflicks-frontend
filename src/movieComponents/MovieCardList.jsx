import { MovieCard } from "./MovieCard";
import "./MovieCardList.css";

export const MovieCardList = ({ movies, editAuth = false, handleRemove }) => {
	return (
		<div className="MovieCardList d-flex flex-wrap justify-content-evenly">
			{movies.map((m) => (
				<MovieCard
					posterPath={m.posterPath}
					id={m.id}
					key={m.id}
					overview={m.overview}
					title={m.title}
					releaseDate={m.releaseDate}
					editAuth={editAuth}
					handleRemove={handleRemove}
				/>
			))}
		</div>
	);
};
