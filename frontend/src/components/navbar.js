import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/session";

import styles from "./navbar.module.css";

function NavBar() {

	const isLoggedIn = useSelector(selectUser);

	if (!isLoggedIn) {
		return (
			<nav className={styles.navigation}>
				<NavLink to="/login" className={styles.nav_link}>Login</NavLink>
				<NavLink to="/register" className={styles.nav_link}>Register</NavLink>
			</nav>
		)
	} else {
		return (
			<nav className={styles.navigation}>
				<NavLink to="/flashcards" className={styles.nav_link}>Flashcards</NavLink>
				<NavLink to="/deck" className={styles.nav_link}>Deck</NavLink>
				<NavLink to="/summary" className={styles.nav_link}>Summary</NavLink>
				<NavLink to="/share" className={styles.nav_link}>Share</NavLink>
				<NavLink to="/logout" className={styles.nav_link}>Logout</NavLink>
			</nav>
		)
	}
}

export default NavBar;