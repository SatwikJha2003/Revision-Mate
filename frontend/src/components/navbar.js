import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
	return (
		<nav>
			<NavLink to="/">Home</NavLink>
			<NavLink to="/login">Login</NavLink>
			<NavLink to="/flashcards">Flashcards</NavLink>
		</nav>
	)
}

export default NavBar;