import '../flashcards.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/manageAccount";
import axios from "axios";
import CSRF from "../components/csrfGetter";
import Redirect from "../components/redirect";

function Deck() {
  const isLoggedIn = useSelector(selectUser);
  const navigate = useNavigate();

  const handleForm = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    axios.post("/decks/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": formData.get("csrf-token")
      }
    }).then(navigate('/flashcards'));
  }

  if (!isLoggedIn)
    return <Redirect />;

  return (
    <div>
      <form id="deck_form" onSubmit={handleForm}>
        <CSRF />
        <label htmlFor="deck_name">Deck name: </label>
        <input type="text" name="deck_name"/><br/>
        <button type="submit">Create deck<br/></button>
      </form>
    </div>
  );

}

export default Deck;