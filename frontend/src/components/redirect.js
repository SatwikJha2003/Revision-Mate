import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Redirect() {
	const navigate = useNavigate();

	useEffect(() => {
      	return navigate("/login");
	}, []);
}

export default Redirect;