import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/session";
import axios from "axios";
import CSRF from "../../components/csrfGetter";
import Redirect from "../../components/redirect";

import styles from "./create.module.css";

function Create({route,navigation}) {
  const isLoggedIn = useSelector(selectUser);
  const startingArray = [{question: "", answer: ""}];
  const [qaArray, setQaArray] = useState(startingArray);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const { deckName } = state || {};

  const handleForm = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    
    axios.post("/deckMaking/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": formData.get("csrf-token")
      }
    }).then(response => {
      if (response.data.error)
        setErrorMsg(response.data.error);
      else
        navigate("/flashcards", {state:{id: response.data.id}});
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
    document.body.className = styles.create_body;
  },[])

  if (!isLoggedIn)
    return <Redirect />;

  return (
      <div className={styles.create_container}>
        <form id="flashcard_form" className={styles.create_form} onSubmit={handleForm}>
          <CSRF />
          <label className={styles.deck_label} htmlFor="deck_name">Deck name: </label>
          <input type="text"
            name="deckname"
            defaultValue={deckName}
            className={styles.create_input}
          />
          <label className={styles.deck_label} htmlFor="share">&nbsp;&nbsp;&nbsp;Share</label>
          <input type="checkbox" name="share" value="share" className={styles.create_checkbox}/>
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
                  />
                  <label className={styles.create_image} htmlFor={"question_image-"+i}>Attach image</label>
                  <input 
                    type="file" 
                    name={"question_image-"+i} 
                    id={"question_image-"+i} 
                    className={styles.attach_image}
                  />
                  <br/>
                  <label className={styles.deck_label} htmlFor="answer">Answer: </label><br/>
                  <textarea
                    rows="2"
                    cols="100"
                    name="answer"
                    defaultValue={element.answer}
                    className={styles.deck_textarea}
                  />
                  <label className={styles.create_image} htmlFor={"answer_image-"+i}>Attach image</label>
                  <input 
                    type="file" 
                    name={"answer_image-"+i} 
                    id={"answer_image-"+i} 
                    className={styles.attach_image}
                  />
                  <br/>
                  <button type="button" onClick={removeInput} className={styles.create_button}>
                    <span className={styles.create_span}>-</span>
                  </button>
                </div>
              )
          })}
          <button type="button" onClick={addInput} className={styles.create_button}>
            <span className={styles.create_span}>+</span>
          </button>
          <button type="submit" className={styles.create_button}>
            <span className={styles.create_span}>Finish</span>
          </button>
        </form>
        <div className={styles.create_error}>{errorMsg}</div>
      </div>
    );

}

export default Create;