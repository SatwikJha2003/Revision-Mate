import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import CSRF from "./csrfGetter";
import styles from "./navbar.module.css";

function FlashcardForm() {
  const startingArray = [{question: "", answer: ""}];
  const [qaArray, setQaArray] = useState(startingArray);

  const getQa = (event) => {
    axios.get("/flashcards", {
      //params: {deck_name:deckName}
    }).then(response => {
      setQaArray([...response.data])
    });
  }

  const handleChange = (event) => {
  }

  const handleForm = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    axios.post("/deckMaking/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": formData.get("csrf-token")
      }
    })
  }

  const addInput = () => {
    setQaArray(element => {
      return [...element, {question: "", answer: ""}];
    });
  }

  const removeInput = (event) => {
    const updatedArray = [...qaArray];
    updatedArray.splice(event.currentTarget.id, 1);
    setQaArray([...updatedArray]);
  }

  useEffect(() => {
    document.body.className = styles.summary_body;
    //getQa();
  },[])

  return (
      <div className={styles.deck_container}>
        <form id="flashcard_form" className={styles.deck_form_two} onSubmit={handleForm}>
          <CSRF />
          <label className={styles.deck_label} htmlFor="deck_name">Deck name: </label><br/>
          <input type="text"
            name="deckname"
            className={styles.login_input}
            //defaultValue={deckName}
            required
          />
          {qaArray.map((element, i) => {
            return (
              <div className={styles.qa_pair} key={i} id={i}>
                  <label className={styles.deck_label} htmlFor="question">Question: </label><br/>
                  <textarea 
                    rows="2"
                    cols="100"
                    name="question"
                    defaultValue={element.question}
                    className={styles.deck_textarea}
                  /><br/>
                  <label className={styles.deck_label} htmlFor="answer">Answer: </label><br/>
                  <textarea
                    rows="2"
                    cols="100"
                    name="answer"
                    defaultValue={element.answer}
                    className={styles.deck_textarea}
                  /><br/>
                  <button onClick={removeInput}>-</button>
                </div>
              )
          })}
          <button onClick={addInput}>+</button>
          <button type="submit">Finish</button>
        </form>
      </div>
    );

}

export default FlashcardForm;