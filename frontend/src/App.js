import React, { useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react"
import axios from "axios";
import store from "./store";

import Login from "./containers/login";
import Register from "./containers/register";
import Logout from "./containers/logout";
import Deck from "./containers/deck";
import Flashcards from "./containers/flashcards";
import NavBar from "./components/navbar";

function App() {
  var persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <NavBar />
          <Routes>
            <Route exact path="/" element="App.js" />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/deck" element={<Deck />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/logout" element={<Logout />}/>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  )
}

/*function App() {
  useEffect(() => {
    let cookieValue = null;
    axios.get("/csrf");
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0,10) === ('csrftoken=')) {
          cookieValue = decodeURIComponent(cookie.substring(11));
          break;
        }
      }
    }
  }, []);

  const handleForm = (event) => {
    event.preventDefault();
    let cookieValue = null;
    axios.get("/csrf");
    /*Code referenced directly from Django docs*/
    /*if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0,10) === ('csrftoken=')) {
          cookieValue = decodeURIComponent(cookie.substring(10));
          break;
        }
      }
    }
    console.log(cookieValue);
    var formData = new FormData(event.target);
    axios.post("/login/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": cookieValue
      }
    }).then(response => console.log(response));
  }

  return (
    <div>
      <form id="login_form" onSubmit={handleForm}>
        <input type="text" name="username"/><br/>
        <input type="password" name="password"/><br/>
        <button type="submit">Submit<br/></button>
      </form>
    </div>
  );
}*/

export default App;