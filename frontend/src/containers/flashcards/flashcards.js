import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/session";
import axios from "axios"; 
import Redirect from "../../components/redirect";
import { getCSRF } from "../../actions/utils";

import Ratings from "../../components/ratings/ratings";
import Comments from "../../components/comments/comments";

import styles from "./flashcards.module.css";

function Flashcards({route,navigation}) {
  const [cards, setCards] = useState([]);
  const [isQuestionSide, setQuestionSide] = useState(true);
  const [isAnswerShown, setAnswerShown] = useState(false);
  const [isShuffled, setShuffled] = useState(false);
  const [index, setIndex] = useState(0);
  const [creatorId, setCreatorId] = useState(-1);
  const [helpMessage, setHelpMessage] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectUser);
  const { state } = useLocation();
  const { id, deckName } = state || {};

  const updateHistory = () => {
    var formData = new FormData();
    formData.append("deckId",id);
    axios.post("/history/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": getCSRF()
      }
    })
  }

  const getFlashcards = () => {
    axios.get("/flashcards", {
      params: {deckId:id}
    }).then(response => {
      setCards([...response.data]);
      setAnswerShown(false);
      setQuestionSide(true);
      var cards = response.data;
      setCreatorId(cards[0].owner);
      for (var i = 0; i < cards.length; i++) {
        var random_i = Math.floor(Math.random() * (i+1));
        var temp = cards[i];
        cards[i] = cards[random_i];
        cards[random_i] = temp;
      }
    });
  }

  // Function to shuffle cards array
  const shuffle = () => {
    for (var i = 0; i < cards.length; i++) {
      var random_i = Math.floor(Math.random() * (i+1));
      var temp = cards[i];
      cards[i] = cards[random_i];
      cards[random_i] = temp;
    }
    setQuestionSide(true);
    setShuffled(!isShuffled);
  }

  // Function to change state of question_side to flip flashcard
  const flip = () => {
    setAnswerShown(true);
    setQuestionSide(!isQuestionSide);
  }

  // Go to test page
  const goTest = () => {
    navigate("/recall", {state:{id:id, deckName:deckName}});
  }

  // Go to create
  const goEdit = () => {
    navigate("/create", {state:{deckName:deckName}});
  }

  // Reset deck confidence
  const reset = () => {
    axios.delete("/confidence", {
      params: {deckId:id},  headers: {
      "X-CSRFToken": getCSRF()
      }
    }).then(response=>setHelpMessage(response.data.success));
  }

  // Got to next question
  const goNext = () => {
    setAnswerShown(false);
    setQuestionSide(true);
    setIndex((index + 1) % cards.length);
  }

  // Go to previous question
  const goPrevious = () => {
    setAnswerShown(false);
    setQuestionSide(true);
    setIndex((index - 1 + cards.length) % cards.length);
  }

  // Set image
  const SetImage = ({src}) => {
    if (src)
      return <img className={styles.flashcard_images} alt="flashcard" src={"http://localhost:8000"+src}/>
  }

  // Get user's decks
  useEffect(() => {
    if (id) {
      document.body.className = styles.flashcards_body;
      const root = document.getElementById('root');
      root.style.cssText = "height: 100%;";
      updateHistory();
      getFlashcards();
    }
  }, []);


  if (!isLoggedIn)
    return <Redirect />;

  return (
    <main className={styles.flashcards_main}>
      <div className={styles.flashcards_dashboard}>
        <Ratings deckId={id} csrf={getCSRF()}/>
        <Comments deckId={id}/>
      </div>
      <div className={styles.flashcard_container}>
        <div className={styles.help}>{helpMessage}</div>
        <div className={styles.button_container_one}>
          <div className={styles.flashcards_deckname}>Deck: {deckName}</div>
          <div onClick={goTest} className={styles.test}>TEST</div>
          <div onClick={reset} className={styles.reset}>RESET</div>
          {creatorId === isLoggedIn.id && <div onClick={goEdit} className={styles.edit}>EDIT</div>}
        </div>
        <div onClick={flip} className={(isQuestionSide ? styles.flashcard_question:styles.flashcard_answer)}>
          <div className={styles.flashcard} key="{cards.length && cards[index].id}">
            <div className={styles.question_side}>{cards.length && cards[index].question}
              <SetImage src={cards.length && cards[index].question_image}/>
            </div>
            <div className={styles.answer_side}>{isAnswerShown && cards.length && cards[index].answer}
              <SetImage src={cards.length && cards[index].answer_image}/>
            </div>
          </div>
        </div>
        <div className={styles.button_container_two}>
          <div onClick={goNext} className={styles.next}>NEXT</div>
          <div onClick={shuffle} className={styles.shuffle}>SHUFFLE</div>
          <div onClick={goPrevious} className={styles.previous}>PREVIOUS</div>
        </div>
      </div>
    </main>
  );

}

export default Flashcards;