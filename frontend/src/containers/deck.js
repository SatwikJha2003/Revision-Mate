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
  const [isCardMaker, setCardMaker] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [textareaValue, setTextareaValue] = useState("");

  const handleDeckForm = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    axios.post("/decks/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": formData.get("csrf-token")
      }
    }).then(response => {
      if (response.data === "Success!") {
        setCardMaker(true);
        setDeckName(formData.get("deck_name"));
        setHelpMessage("");
      } else {
        setHelpMessage(response.data);
      }
    })
  }

  const handleCardForm = (event) => {
    event.preventDefault();
    if (event.nativeEvent.submitter.name === "cancel_button") {
      setCardMaker(false);
      setDeckName("");
    } else {
      var formData = new FormData(event.target);
      axios.post("/flashcards/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": formData.get("csrf-token")
        }
      }).then(response => {
        if (response.data === "Success!") {
          setHelpMessage("Flashcard added successfully!");
          setTextareaValue("");
        }
      })
    }
  }

  if (!isLoggedIn)
    return <Redirect />;

  if (!isCardMaker) {
    return (
      <div>
        <form id="deck_form" onSubmit={handleDeckForm}>
          <CSRF />
          <label htmlFor="deck_name">Deck name: </label>
          <input type="text" name="deck_name"/><br/>
          <button type="submit">Create deck<br/></button>
        </form>
        <div>{helpMessage}</div>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Deck: {deckName}</h2>
        <form id="flashcard_form" onSubmit={handleCardForm}>
          <CSRF />
          <label htmlFor="question">Question: </label><br/>
          <textarea 
            onChange={e => setTextareaValue(e.target.value)}
            id="question_input" 
            name="question"
            value={textareaValue}
          /><br/>
          <label htmlFor="answer">Answer: </label><br/>
          <textarea 
            onChange={e => setTextareaValue(e.target.value)}
            id="answer_input" 
            name="answer"
            value={textareaValue}
          /><br/>
          <button type="submit" name="create_button">Create flashcard<br/></button>
          <button type="submit" name="cancel_button">Cancel</button>
        </form>
        <div>{helpMessage}</div>
      </div>
    )
  }

}

export default Deck;