import { Link } from "react-router";

export const NotFound = () => {
	return (
		<div className="NotFound">
			<h1>404</h1>
			<h2>Oops... page not found.</h2>
			<h4>
				Not sure how you ended up here but the fun starts{" "}
				<Link to="/">here</Link>.
			</h4>
		</div>
	);
};
