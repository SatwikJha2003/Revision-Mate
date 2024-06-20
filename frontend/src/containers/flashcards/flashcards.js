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
          <ul>{deckList}</ul>
        </div>
      </main>
    )

  return (
    <main className={styles.flashcards_main}>
      <div className={styles.flashcards_list}>
        <ul>{deckList}</ul>
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

/*class Flashcards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      question_side: true,
      shuffled: false,
      index: 0
    }
  }

  componentDidMount() {
    // Get question and answers from Django
    axios.get("/flashcards")
         .then((response) => {
            var cards = response.data;
            for (var i = 0; i < cards.length; i++) {
              var random_i = Math.floor(Math.random() * (i+1));
              var temp = cards[i];
              cards[i] = cards[random_i];
              cards[random_i] = temp;
            }
            this.setState({ cards });
            console.log(cards[0])
         });
  }

  // Function to shuffle cards array
  Shuffle = () => {
    for (var i = 0; i < this.state.cards.length; i++) {
      var random_i = Math.floor(Math.random() * (i+1));
      var temp = this.state.cards[i];
      this.state.cards[i] = this.state.cards[random_i];
      this.state.cards[random_i] = temp;
    }
    this.setState({shuffled: !this.state.shuffled});
  }

  // Function to change state of question_side to flip flashcard
  Flip = () => {
      this.setState({question_side: !this.state.question_side});
  }

  // Got to next question
  GoNext = () => {
    this.setState({index: (this.state.index + 1) % this.state.cards.length});
  }

  // Go to previous question
  GoPrevious = () => {
    this.setState({index: (this.state.index - 1 + this.state.cards.length) % this.state.cards.length});
  }

  render() {
    return (
      <div>
        <div onClick={this.Shuffle}>shuffle</div>
        <div onClick={this.Flip} className={"flashcard" +  (this.state.question_side ? "-question":"-answer")}>
          <div className="flashcard" key="{this.state.cards.length && this.state.cards[this.state.index].id}">
            <div className="question-side">{this.state.cards.length && this.state.cards[this.state.index].question}</div>
            <div className="answer-side">{this.state.cards.length && this.state.cards[this.state.index].answer}</div>
          </div>
        </div>
        <div onClick={this.GoNext}>next</div>
        <div onClick={this.GoPrevious}>previous</div>
      </div>
    );
  }
}

export default Flashcards;

{/*<div onClick={this.shuffle}>shuffle</div>
<div onClick={this.flip} className={"flashcard" +  (this.state.question_side ? "-question":"-answer")}>
  {this.state.cards.map((card) => {
    return(
      <div className="flashcard" key="{card.id}">
        <div className="question-side">{card.question}</div>
        <div className="answer-side">{card.answer}</div>
      </div>
    )
  })}
</div>}*/