import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CSRF from "../../components/csrfGetter";

import styles from "./register.module.css";

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
    <main>
      <form id="register_form" onSubmit={handleForm}>
        <CSRF />
        <label htmlFor="first_name">First name: </label>
        <input type="text" name="first_name" required/>
        <label htmlFor="last_name">Last name: </label>
        <input type="text" name="last_name" required/>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" required/>
        <label htmlFor="email">Email: </label>
        <input type="email" name="email" required/>
        <label htmlFor="password_one">Password: </label>
        <input type="password" name="password_one" required/>
        <label htmlFor="password_two">Confirm Password: </label>
        <input type="password" name="password_two" required/><br/>
        <button type="submit"><span>REGISTER</span></button>
      </form>
      <p className={styles.error}>{errorMessage}</p>
    </main>
  );
}

export default Register;