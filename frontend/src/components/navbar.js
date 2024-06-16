import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
	return (
		<nav>
			<NavLink to="/">Home</NavLink>
			<NavLink to="/login">Login</NavLink>
			<NavLink to="/register">Register</NavLink>
			<NavLink to="/flashcards">Flashcards</NavLink>
			<NavLink to="/logout">Logout</NavLink>
		</nav>
	)
}

export default NavBar;