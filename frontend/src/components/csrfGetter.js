import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCSRF } from "../actions/utils";

function CSRFGetter(props, ref) {
	const [csrf, setCsrf] = useState("");

	useEffect(() => {
		const getData = async () => {
			try {
				await axios.get("/csrf");
			} catch (err) {}
		}
		getData();
		setCsrf(getCSRF());
	}, []);

	return (
		<input type="hidden" name="csrf-token" value={csrf} ref={ref}/>
	);
}

export default React.forwardRef(CSRFGetter);