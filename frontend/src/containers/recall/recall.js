import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/session";
import axios from "axios"; 
import Redirect from "../../components/redirect";
import { getCSRF } from "../../actions/utils";

import styles from "./recall.module.css";

function Recall({route,navigation}) {
  const [cards, setCards] = useState([]);
  const [isQuestionSide, setQuestionSide] = useState(true);
  const [isAnswerShown, setAnswerShown] = useState(false);
  const [index, setIndex] = useState(0);
  const isLoggedIn = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to get flashcards and shuffle them
  const getFlashcards = () => {
    axios.get("/recall", {
      params: {deckId:location.state.id}
    }).then(response => {
      setCards([...response.data.flashcards]);
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

  // Function to change state of question_side to flip flashcard
  const flip = () => {
    setAnswerShown(true);
    setQuestionSide(!isQuestionSide);
  }

  // Function to increment count of each confidence level
  const increaseConfidence = (i) => {
    const confidence = {
      id: cards[index].id,
      confidence: i
    };

    if (index+1 !== cards.length) {
      setQuestionSide(true);
      setAnswerShown(false);
      setIndex(index+1);
    } else {
      navigate("/flashcards", {state:{id:location.state.id, deckName:location.state.deckName}});
    }

    axios.post("/confidence/", confidence, {
      headers: {
        "X-CSRFToken": getCSRF()
      }
    })
  }

  //Get deck's flashcards
  useEffect(() => {
    document.body.className = styles.recall_body;
    const root = document.getElementById('root');
    root.style.cssText = "height: 100%;";
    getFlashcards();
  }, []);

  // Set image
  const SetImage = ({src}) => {
    console.log(src);
    if (src)
      return <img className={styles.flashcard_images} alt="flashcard" src={"http://localhost:8000"+src}/>
  }

  if (!isLoggedIn)
    return <Redirect />;

  return (
    <main className={styles.recall_main}>
      <div className={styles.recall_container}>
        <div onClick={flip} className={(isQuestionSide ? styles.recall_question:styles.recall_answer)}>
          <div className={styles.flashcard} key="{cards.length && cards[index].id}">
            <div className={styles.question_side}>{cards.length && cards[index].question}
              <SetImage src={cards.length && cards[index].question_image}/>
            </div>
            <div className={styles.answer_side}>{isAnswerShown && cards.length && cards[index].answer}
              <SetImage src={cards.length && cards[index].answer_image}/>
            </div>
          </div>
        </div>
        {isAnswerShown ? (
        <div className={styles.recall_confidence}>
          <div className={styles.recall_conf_one} 
            onClick={() => {increaseConfidence(0)}}>
            Could not remember the answer<br/>
          </div>
          <div className={styles.recall_conf_two} 
            onClick={() => {increaseConfidence(0.3)}}>
            Remembered parts of the answer<br/>
          </div>
            <div className={styles.recall_conf_three} 
            onClick={() => {increaseConfidence(0.6)}}>
            Remembered the answer after a while<br/>
          </div>
            <div className={styles.recall_conf_four} 
            onClick={() => {increaseConfidence(1)}}>
            Remembered the answer quickly<br/>
          </div>
        </div>) : ""}
      </div>
    </main>
  );

}

export default Recall;