import React, { useState, useEffect } from "react";
import axios from "axios";
import CSRF from "../csrfGetter";

import styles from "./comments.module.css";

function Comments({ deckId }) {
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState([]);

	const getComments = () => {
		axios.get("/comments", {
	      params: {"deckId":deckId}
	    }).then(response => {
	    	setComments([...response.data["comments"]]);
	    })
	}

	const handleForm = (event) => {
		event.preventDefault();
		setComment("");
		var formData = new FormData(event.target);
		formData.append("deckId",deckId);
		axios.post("/comments/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
        		"X-CSRFToken": formData.get("csrf-token")
			}
		}).then(getComments());
	}

	useEffect(() => {
		getComments();
	},[])

	const commentsList = comments.map(c => <div key={c.id}
		                                  	value={c.id}
		                                  	className={styles.comment}>{c.username}: {c.comment}
		                                   </div>);

	return (
		<div className={styles.comments}>
			<form id="comments_form" className={styles.comments_form} onSubmit={handleForm}>
				<CSRF />
				<label className={styles.deck_label} htmlFor="deck_name">Leave a comment: </label><br/>
				<textarea 
					className={styles.comment_box}
					name="comment"
					value={comment}
					onChange={e=>setComment(e.currentTarget.value)}
				/>
		      <button type="submit" className={styles.comment_submit}>
		      	<span className={styles.comment_span}>Submit</span>
	          </button><br/>
		    </form>
		    {commentsList}
		</div>
	)
}

export default Comments;