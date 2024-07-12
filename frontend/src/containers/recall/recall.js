import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/session";
import axios from "axios"; 
import Redirect from "../../components/redirect";
import { getCSRF } from "../../actions/utils";

import styles from "./recall.module.css";

function Recall({route,navigation}) {
  const [cards, setCards] = useState([]);
  const [deckName, setDeckName] = useState("");
  const [isQuestionSide, setQuestionSide] = useState(true);
  const [isAnswerShown, setAnswerShown] = useState(false);
  const [index, setIndex] = useState(0);
  const [confidenceArray, setConfidenceArray] = useState([0,0,0,0])
  const [confidence, setConfidence] = useState(new FormData());
  const isLoggedIn = useSelector(selectUser);
  const location = useLocation();

  // Function to get flashcards and shuffle them
  const getFlashcards = () => {
    axios.get("/flashcards", {
      params: {deckId:location.state.id}
    }).then(response => {
      setCards([...response.data]);
      setAnswerShown(false);
      setQuestionSide(true);
      var cards = response.data;
      for (var i = 0; i < cards.length; i++) {
        var random_i = Math.floor(Math.random() * (i+1));
        var temp = cards[i];
        cards[i] = cards[random_i];
        cards[random_i] = temp;
      }
    });
  }

  const handleDeckForm = (event) => {
    event.preventDefault();
    axios.get("/flashcards", {
      params: {deck_name:deckName}
    }).then(response => {
      console.log(response.data);
    });
  }

  // Function to change state of question_side to flip flashcard
  const flip = () => {
    setAnswerShown(true);
    setQuestionSide(!isQuestionSide);
  }

  // Function to save confidence to database
  const postConfidence = () => {
    axios.post("/confidence/", confidence, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": getCSRF()
      }
    })
  }

  // Function to increment count of each confidence level
  const increaseConfidence = (i) => {
    const newConfidenceArray = confidenceArray.map((count,index) => {
      if (i == index)
        return count + 1;
      else
        return count;
    })
    setConfidenceArray(newConfidenceArray);
    confidence.append(cards[index].id,i);

    if (index+1 != cards.length) {
      setQuestionSide(true);
      setAnswerShown(false);
      setIndex(index+1);
    }
    else
      postConfidence();
  }

  //Get deck's flashcards
  useEffect(() => {
    document.body.className = styles.recall_body;
    const root = document.getElementById('root');
    root.style.cssText = "height: 100%;";
    getFlashcards();
  }, []);

  /*const deckList = decks.filter(element=>element.deck_name.toLowerCase().includes(search))
                        .map(deck => <li key={deck.id} 
                                      value={deck.deck_name}
                                      className={(deckName === deck.deck_name ? styles.deck_selected:styles.deck)}
                                     >{deck.deck_name}</li>);*/

  if (!isLoggedIn)
    return <Redirect />;

  return (
    <main className={styles.recall_main}>
      <div className={styles.recall_container}>
        <div onClick={flip} className={(isQuestionSide ? styles.recall_question:styles.recall_answer)}>
          <div className={styles.flashcard} key="{cards.length && cards[index].id}">
            <div className={styles.question_side}>{cards.length && cards[index].question}</div>
            <div className={styles.answer_side}>{isAnswerShown && cards.length && cards[index].answer}</div>
          </div>
        </div>
        {isAnswerShown ? (
        <div className={styles.recall_confidence}>
          <div className={styles.recall_conf_one} 
            onClick={() => {increaseConfidence(0)}}>
            Could not remember the answer<br/>
            Count: {confidenceArray[0]}
          </div>
          <div className={styles.recall_conf_two} 
            onClick={() => {increaseConfidence(1)}}>
            Remembered parts of the answer<br/>
            Count: {confidenceArray[1]}
          </div>
            <div className={styles.recall_conf_three} 
            onClick={() => {increaseConfidence(2)}}>
            Remembered the answer after a while<br/>
            Count: {confidenceArray[2]}
          </div>
            <div className={styles.recall_conf_four} 
            onClick={() => {increaseConfidence(3)}}>
            Remembered the answer quickly<br/>
            Count: {confidenceArray[3]}
          </div>
        </div>) : ""}
      </div>
    </main>
  );

}

export default Recall;