import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/session";
import axios from "axios";
import CSRF from "../../components/csrfGetter";
import Redirect from "../../components/redirect";

import styles from "./deck.module.css";

function Deck() {
  const isLoggedIn = useSelector(selectUser);
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [isCardMaker, setCardMaker] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [questionValue, setQuestionValue] = useState("");
  const [answerValue, setAnswerValue] = useState("");

  const getDecks = () => {
    axios.get("/decks")
     .then((response) => {
        setDecks([...response.data]);
     });
  }

  const handleDeckLink = (event) => {
    setCardMaker(true);
    setDeckName(event.target.getAttribute("value"));
    setHelpMessage("");
  }

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
        getDecks();
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
      setHelpMessage("");
    } else if (event.nativeEvent.submitter.name === "delete_button") {
      var formData = new FormData(event.target);
      formData.append("deck_name", deckName);
      axios.delete("/decks/", { data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": formData.get("csrf-token")
        }
      }).then(response => {
        if (response.data === "Success!") {
          getDecks();
          setHelpMessage("Deck deleted!");
          setCardMaker(false);
        }
      })
    } else {
      var formData = new FormData(event.target);
      formData.append("deck_name", deckName);
      axios.post("/flashcards/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": formData.get("csrf-token")
        }
      }).then(response => {
        if (response.data === "Success!") {
          setHelpMessage("Flashcard added successfully!");
          setQuestionValue("");
          setAnswerValue("");
        }
      })
    }
  }

  /*Get user's decks*/
  useEffect(() => {
    document.body.className = styles.deck_body;
    getDecks();
  }, []);

  const deckList = decks.map(deck => <li key={deck.id} 
                                      onClick={handleDeckLink}
                                      value={deck.deck_name}
                                      className={styles.deck_li}>{deck.deck_name}</li>);

  if (!isLoggedIn)
    return <Redirect />;

  if (!isCardMaker) {
    return (
      <div className={styles.deck_container}>
        <form id="deck_form" className={styles.deck_form} onSubmit={handleDeckForm}>
          <CSRF />
          <label className={styles.deck_label} htmlFor="deck_name">Deck name:&nbsp;</label>
          <input type="text" name="deck_name" className={styles.deck_input}/><br/>
          <button type="submit" className={styles.deck_submit}>
            <span className={styles.deck_span}>Create deck</span>
          </button><br/>
        </form>
        <div>{helpMessage}</div>
        <ul className={styles.deck_ul}>
          {deckList}
        </ul>
      </div>
    );
  } else {
    return (
      <div className={styles.deck_container}>
        <form id="flashcard_form" className={styles.deck_form_two} onSubmit={handleCardForm}>
          <CSRF />
          <label className={styles.deck_label} htmlFor="deck_name">Deck: {deckName}</label><br/>
          <label className={styles.deck_label} htmlFor="question">Question: </label><br/>
          <textarea 
            rows="2"
            cols="100"
            onChange={e => setQuestionValue(e.target.value)}
            id="question_input" 
            name="question"
            className={styles.deck_textarea}
            value={questionValue}
          /><br/>
          <label className={styles.deck_label} htmlFor="answer">Answer: </label><br/>
          <textarea
            rows="2"
            cols="100"
            onChange={e => setAnswerValue(e.target.value)}
            id="answer_input" 
            name="answer"
            className={styles.deck_textarea}
            value={answerValue}
          /><br/>
          <div className={styles.deck_buttons}>
            <button type="submit" className={styles.deck_submits} name="create_button">
              <span className={styles.deck_span}>Create flashcard</span>
            </button>
            <button type="submit" className={styles.deck_submits} name="delete_button">
              <span className={styles.deck_span}>Delete deck</span>
            </button>
            <button type="submit" className={styles.deck_submits} name="cancel_button">
              <span className={styles.deck_span}>Cancel</span>
            </button>
          </div>
          <div className={styles.deck_help}>{helpMessage}</div>
        </form>
      </div>
    )
  }

}

export default Deck;