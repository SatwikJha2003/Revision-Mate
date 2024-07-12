import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "./ratings.module.css";

function Ratings({ deckId, csrf }) {
	const [star, setStar] = useState(0);
	const [rating, setRating] = useState(0);

	const getUserRating = () => {
		axios.get("/ratings", {
	      params: {"deckId":deckId}
	    }).then(response => {
	    	setStar(response.data["user rating"] - 1);
	    	setRating(response.data["average rating"]);
	    })
	}

	const clickStar = (event) => {
		setStar(event.target.id);
		var formData = new FormData();
		formData.append("deckId",deckId);
    	formData.append("userRating",event.target.id);
		axios.post("/ratings/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
        		"X-CSRFToken": csrf
			}
		}).then(response => {
			console.log(response);
	    	setRating(response.data["average rating"]);
	    });
	}

	const stars = [...Array(5)].map((e,i) => <span className={i > star ? styles.star_unselected : styles.star_selected} 
											  key={i} 
											  id={i}
											  onClick={clickStar}
											  >&#9733;</span>);

	useEffect(() => {
		getUserRating();
	},[])

	return (
		<div className={styles.rating}>
			{stars} {rating}
		</div>
	)
}

export default Ratings;