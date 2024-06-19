import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../features/manageAccount";
import axios from "axios";
import CSRF from "../../components/csrfGetter";

import "./login.module.css";

function Login() {

  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

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
      }
      else
        setErrorMessage(response.data);
    });
  }

  return (
    <body>
      <h1>REVISION MATE</h1>
      <form id="login_form" onSubmit={handleForm}>
        <CSRF />
        <label htmlFor="username">USERNAME: </label>
        <input type="text" name="username"/>
        <label htmlFor="password">PASSWORD: </label>
        <input type="password" name="password"/><br/>
        <button type="submit"><span>LOGIN</span></button>
      </form>
      <div>{errorMessage}</div>
    </body>
  );
}

export default Login;