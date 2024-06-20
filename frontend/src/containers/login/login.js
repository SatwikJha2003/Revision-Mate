import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/manageAccount";
import axios from "axios";
import CSRF from "../../components/csrfGetter";

import styles from "./login.module.css";

function Login() {

  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleForm = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    axios.post("/login/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": formData.get("csrf-token")
      }
    }).then(response => {
      if (response.data === "Success") {
        dispatch(login({
          name: "hello",
          loggedIn: true
          })
        )
        navigate("/flashcards");
      }
      else
        setErrorMessage(response.data);
    });
  }

  useEffect(() => {
    document.body.className = styles.login_body;
  })

  return (
    <main className={styles.login_main}>
      <h1 className={styles.login_header}>REVISION MATE</h1>
      <form id="login_form" className={styles.login_form} onSubmit={handleForm}>
        <CSRF />
        <label className={styles.login_label} htmlFor="username">USERNAME: </label>
        <input type="text" name="username" className={styles.login_input}/>
        <label className={styles.login_label} htmlFor="password">PASSWORD: </label>
        <input type="password" name="password" className={styles.login_input}/><br/>
        <button type="submit" className={styles.login_submit}>
          <span className={styles.login_span}>LOGIN</span>
        </button><br/>
        <p className={styles.login_error}>{errorMessage}</p>
      </form>
    </main>
  );
}

export default Login;