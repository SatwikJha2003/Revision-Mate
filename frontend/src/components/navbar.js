import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/manageAccount";

function NavBar() {

	const isLoggedIn = useSelector(selectUser);

	if (!isLoggedIn) {
		return (
			<nav>
				<NavLink to="/login">Login</NavLink>
				<NavLink to="/register">Register</NavLink>
			</nav>
		)
	} else {
		return (
			<nav>
				<NavLink to="/deck">Deck</NavLink>
				<NavLink to="/flashcards">Flashcards</NavLink>
				<NavLink to="/summary">Summary</NavLink>
				<NavLink to="/logout">Logout</NavLink>
			</nav>
		)
	}
}

export default NavBar;