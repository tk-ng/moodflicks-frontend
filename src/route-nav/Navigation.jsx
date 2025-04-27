import {
	Navbar,
	Nav,
	NavbarBrand,
	NavItem,
	NavbarToggler,
	Collapse,
} from "reactstrap";
import { NavLink, Link } from "react-router";
import { useContext, useState } from "react";
import { UserContext } from "../userComponents/UserContext";

export const Navigation = ({ logout }) => {
	const { currUser } = useContext(UserContext);

	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	return (
		<div className="Navigation mb-3">
			<Navbar expand="md" dark={true}>
				<NavbarBrand href="/">MoodFlicks</NavbarBrand>
				<NavbarToggler onClick={toggle} />
				<Collapse isOpen={isOpen} navbar>
					<Nav navbar className="ms-auto">
						{currUser ? (
							<>
								<NavItem>
									<NavLink className="nav-link" to="/moods/new">
										Create Mood
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink className="nav-link" to="/moods">
										Moods
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink className="nav-link" to="/movies">
										Movies
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										className="nav-link"
										to={`/users/${currUser.username}`}
									>
										Profile
									</NavLink>
								</NavItem>
								<NavItem>
									<Link className="nav-link" to="/" onClick={logout}>
										Log out
									</Link>
								</NavItem>
							</>
						) : (
							<>
								<NavItem>
									<NavLink className="nav-link" to="/moods">
										Moods
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink className="nav-link" to="/movies">
										Movies
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink className="nav-link" to="/login">
										Login
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink className="nav-link" to="/signup">
										Sign Up
									</NavLink>
								</NavItem>
							</>
						)}
					</Nav>
				</Collapse>
			</Navbar>
		</div>
	);
};
