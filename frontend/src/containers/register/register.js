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

  useEffect(() => {
    document.body.className = styles.register_body;
  })

  return (
    <main className={styles.register_main}>
      <form id="register_form" className={styles.register_form} onSubmit={handleForm}>
        <CSRF />
        <label className={styles.register_label} htmlFor="first_name">First name: </label>
        <input type="text" name="first_name" required className={styles.register_input}/>
        <label className={styles.register_label} htmlFor="last_name">Last name: </label>
        <input type="text" name="last_name" required className={styles.register_input}/>
        <label className={styles.register_label} htmlFor="username">Username: </label>
        <input type="text" name="username" required className={styles.register_input}/>
        <label className={styles.register_label} htmlFor="email">Email: </label>
        <input type="email" name="email" required className={styles.register_input}/>
        <label className={styles.register_label} htmlFor="password_one">Password: </label>
        <input type="password" name="password_one" required className={styles.register_input}/>
        <label className={styles.register_label} htmlFor="password_two">Confirm Password: </label>
        <input type="password" name="password_two" required className={styles.register_input}/><br/>
        <button type="submit" className={styles.register_submit}>
          <span className={styles.register_span}>REGISTER</span>
        </button>
      </form>
      <p className={styles.register_error}>{errorMessage}</p>
    </main>
  );
}

export default Register;