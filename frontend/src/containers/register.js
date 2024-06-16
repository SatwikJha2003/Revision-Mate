import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CSRF from "../components/csrfGetter";

function Register() {

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const handleForm = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    axios.post("/register/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": formData.get("csrf-token")
      }
    }).then(response => {
      if (response.data === "Success")
        navigate("/login");
      else
        setErrorMessage(response.data);
    })
  }

  return (
    <div>
      <form id="register_form" onSubmit={handleForm}>
        <CSRF />
        <label htmlFor="first_name">First name: </label>
        <input type="text" name="first_name"/><br/>
        <label htmlFor="last_name">Last name: </label>
        <input type="text" name="last_name"/><br/>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username"/><br/>
        <label htmlFor="email">Email: </label>
        <input type="email" name="email"/><br/>
        <label htmlFor="password_one">Password: </label>
        <input type="password" name="password_one"/><br/>
        <label htmlFor="password_two">Confirm Password: </label>
        <input type="password" name="password_two"/><br/>
        <button type="submit">Submit<br/></button>
      </form>
      <div>{errorMessage}</div>
    </div>
  );
}

export default Register;