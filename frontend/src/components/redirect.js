import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Redirect() {
	const navigate = useNavigate();

	useEffect(() => {
      	return navigate("/login");
	}, []);
}

export default Redirect;