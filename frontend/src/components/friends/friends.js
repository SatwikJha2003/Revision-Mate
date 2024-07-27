import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/session";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCSRF } from "../../actions/utils.js";

import styles from "./friends.module.css";

function Friends() {
	const [friendList, setFriendList] = useState([]);
	const [isOpen, setOpen] = useState(false);
	const [isFriends, setIsFriends] = useState(true);
	const [userSearch, setUserSearch] = useState([]);
	const [sent, setSent] = useState([]);
	const [received, setReceived] = useState([]);
	const navigate = useNavigate();

	const isLoggedIn = useSelector(selectUser);

	const getFriends = () => {
		axios.get("/friends").then(response => {
			setFriendList([]);
	    	setFriendList([...response.data.friends]);
	    })
	}

	const getRequests = () => {
		axios.get("/requests").then(response => {
			setUserSearch([]);
			setSent([]);
			setReceived([]);
	    	setSent([...response.data.sent]);
	    	setReceived([...response.data.received]);
	    })
	}

	const toggleFriends = () => {

		// If list is already open and not showing friends
		if (isOpen && !isFriends) {
			setIsFriends(true);
			getFriends();
		// If list is open and showing friends, close list
		} else if (isOpen) {
			setOpen(false);
		// If list is not open
		} else {
			setOpen(true);
			setIsFriends(true);
			getFriends();
		}
	}

	const toggleRequests = () => {

		// If list is already open and not showing requests
		if (isOpen && isFriends) {
			setIsFriends(false);
			getRequests();
		// If list is open and showing requests, close list
		} else if (isOpen) {
			setOpen(false);
		// If list is not open
		} else {
			setOpen(true);
			setIsFriends(false);
			getRequests();
		}
	}

	const changePage = (event) => {
		navigate("/friend", {state:{id:event.target.getAttribute("value")}});
		navigate(0);
	}

	const handleForm = (event) => {
		event.preventDefault();
    	var formData = new FormData(event.target);
		axios.get("/users", {
	      params: {username:formData.get("username")}
	    }).then(response => {
	    	setUserSearch([...response.data.users]);
	    })
	}

	const sendRequest = (event) => {
		const formData = new FormData();
		formData.append("requested", event.target.value);
		axios.post("/requests/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
        		"X-CSRFToken": getCSRF()
			}
		});
		getRequests();
	}

	useEffect(() => {
		getFriends();
		getRequests();
		console.log("Fdsfds")
	},[])


	const friendsList = friendList.map(friend => <li key={friend.user_two}
			                                  	  value={friend.user_two}
			                                  	  className={styles.friend}
			                                  	  onClick={changePage}>{friend.username}
			                                     </li>);

    const usersList = userSearch.map(user => <li key={user.id}
		                                  	  className={styles.user}>{user.username}
		                                  	  <button type="button" value={user.id} onClick={sendRequest}>+</button>
		                                     </li>);

	const sentList = sent.map(s => <li key={s.id}
                                  	   className={styles.user}>{s.username}	Pending
                                    </li>);

	const receivedList = received.map(r => <li key={r.id}
		                                  	   className={styles.user}>{r.username}
		                                  	   <button type="button" value={r.user_one} onClick={sendRequest}>+</button>
		                                    </li>);

	if (isLoggedIn) {
		return (
			<div className={styles.friends}>
				<button type="button" className={(isOpen && isFriends) ? styles.toggle_friends_select : styles.toggle_friends} onClick={toggleFriends}>FRIENDS</button>
				<button type="button" className={(isOpen && !isFriends) ? styles.toggle_requests_select : styles.toggle_requests} onClick={toggleRequests}>REQUESTS</button>
				{isOpen && isFriends && (
					<ul className={styles.friends_list}>{friendsList}</ul>
				)}
				{isOpen && !isFriends && (
					<div className={styles.request_container}>
						<form id="request_form" className={styles.request_form} onSubmit={handleForm}>
					        <label className={styles.request_label} htmlFor="request">SEARCH: </label>
					        <input type="text" name="username" className={styles.request_input} required/>
					        <button type="submit" className={styles.request_submit}>
					          FIND
					        </button><br/>
					    </form>
					    <ul className={styles.requests_list}>{usersList}{receivedList}{sentList}</ul>
					</div>
				)}
			</div>
		)
	}
}

export default Friends;