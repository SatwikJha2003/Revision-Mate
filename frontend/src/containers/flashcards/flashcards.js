import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/manageAccount";
import axios from "axios"; 
import Redirect from "../../components/redirect";
import CSRF from "../../components/csrfGetter";

import styles from "./flashcards.module.css";

function Flashcards() {
  const [cards, setCards] = useState([]);
  const [decks, setDecks] = useState([]);
  const [deckName, setDeckName] = useState("");
  const [isShowDeck, setShowDeck] = useState(false);
  const [isQuestionSide, setQuestionSide] = useState(true);
  const [isAnswerShown, setAnswerShown] = useState(false);
  const [isShuffled, setShuffled] = useState(false);
  const [index, setIndex] = useState(0);
  const isLoggedIn = useSelector(selectUser);

  const getDecks = () => {
    axios.get("/decks")
     .then((response) => {
        setDecks([...response.data]);
     });
  }

  const handleDeckLink = (event) => {
    if (!event.target.getAttribute("class").includes("selected")) {
      setDeckName(event.target.getAttribute("value"));
      axios.get("/flashcards", {
        params: {deck_name:event.target.getAttribute("value")}
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
        setShowDeck(true);
      });
    }
  }

  const handleDeckForm = (event) => {
    event.preventDefault();
    axios.get("/flashcards", {
      params: {deck_name:deckName}
    }).then(response => {
      console.log(response.data);
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

  /*Get user's decks*/
  useEffect(() => {
    document.body.className = styles.flashcards_body;
    const root = document.getElementById('root');
    root.style.cssText = "height: 100%;";
    getDecks();
  }, []);

  const deckList = decks.map(deck => <li key={deck.id} 
                                      onClick={handleDeckLink}
                                      value={deck.deck_name}
                                      className={(deckName === deck.deck_name ? styles.deck_selected:styles.deck)}
                                     >{deck.deck_name}</li>);

  if (!isLoggedIn)
    return <Redirect />;

  if (!isShowDeck)
    return (
      <main className={styles.flashcards_main}>
        <div className={styles.flashcards_list}>
          <ul className={styles.flashcards_ul}>{deckList}</ul>
        </div>
      </main>
    )

  return (
    <main className={styles.flashcards_main}>
      <div className={styles.flashcards_list}>
        <ul className={styles.flashcards_ul}>{deckList}</ul>
      </div>
      <div className={styles.flashcard_container}>
        <div onClick={flip} className={(isQuestionSide ? styles.flashcard_question:styles.flashcard_answer)}>
          <div className={styles.flashcard} key="{cards.length && cards[index].id}">
            <div className={styles.question_side}>{cards.length && cards[index].question}</div>
            <div className={styles.answer_side}>{isAnswerShown && cards.length && cards[index].answer}</div>
          </div>
        </div>
        <div className={styles.button_container}>
          <div onClick={goNext} className={styles.next}>NEXT</div>
          <div onClick={shuffle} className={styles.shuffle}>SHUFFLE</div>
          <div onClick={goPrevious} className={styles.previous}>PREVIOUS</div>
        </div>
      </div>
    </main>
  );

}

export default Flashcards;