import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/manageAccount";
import axios from "axios";
import CSRF from "../components/csrfGetter"

function Login() {

  const dispatch = useDispatch();

  const handleForm = (event) => {
    event.preventDefault();
    dispatch(
      login({
        name: "hello",
        loggedIn: true
      })
    )
    var formData = new FormData(event.target);
    axios.post("/login/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": formData.get("csrf-token")
      }
    }).then(response => console.log(response));
  }

  return (
    <div>
      <form id="login_form" onSubmit={handleForm}>
        <CSRF />
        <input type="text" name="username"/><br/>
        <input type="password" name="password"/><br/>
        <button type="submit">Submit<br/></button>
      </form>
    </div>
  );
}

export default Login;