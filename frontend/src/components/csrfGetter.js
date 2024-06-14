import React, { useState, useEffect } from "react";
import axios from "axios";

function CSRFGetter() {
	const [csrf, setCsrf] = useState("");

	const getCSRF = () => {
		let cookieValue = null;
		/*Code referenced directly from official Django docs*/
		if (document.cookie && document.cookie !== '') {
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				const cookie = cookies[i].trim();
				if (cookie.substring(0,10) === ('csrftoken=')) {
					cookieValue = decodeURIComponent(cookie.substring(10));
					return cookieValue;
				}
			}
		}
	}

	useEffect(() => {
		const getData = async () => {
			try {
				await axios.get("/csrf");
			} catch (err) {}
		}
		setCsrf(getCSRF());
	}, []);

	return (
		<input type="hidden" name="csrf-token" value={csrf} />
	);
}

export default CSRFGetter;