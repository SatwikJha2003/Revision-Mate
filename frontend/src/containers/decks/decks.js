import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/session";
import axios from "axios";
import Redirect from "../../components/redirect";

import styles from "./decks.module.css";

function Decks() {
  const isLoggedIn = useSelector(selectUser);
  const [decks, setDecks] = useState([]);
  const [counter, setCounter] = useState(0);
  const [search, setSearch] = useState("");
  const [creator, setCreator] = useState("");
  const [isAlpha, setAlpha] = useState(0);
  const [isRatingAsc, setRatingAsc] = useState(2);
  const [isViewsAsc, setViewsAsc] = useState(2);
  const [isCountAsc, setCountAsc] = useState(2);
  const navigate = useNavigate();

  const getDecks = () => {
    axios.get("/decks")
     .then((response) => {
        setDecks([...response.data].sort((a,b)=>a.deck_name>b.deck_name ? 1:-1));
     });
  }

  // Arrange decks in alphabetical order
  const changeAlphaOrder = () => {
    
    setRatingAsc(2);
    setViewsAsc(2);
    setCountAsc(2);

    if (isAlpha === 2)
      setAlpha(0);
    else
      setAlpha(isAlpha ^ 1);

    if (isAlpha === 0)
      setDecks([...decks].sort((a,b)=>a.deck_name>b.deck_name ? -1:1));
    else
      setDecks([...decks].sort((a,b)=>a.deck_name>b.deck_name ? 1:-1));
  }

  // Arrange decks in  order of rating score
  const changeRatingOrder = () => {

    setAlpha(2);
    setViewsAsc(2);
    setCountAsc(2);

    if (isRatingAsc === 2)
      setRatingAsc(0)
    else
      setRatingAsc(isRatingAsc ^ 1);

    if (isRatingAsc === 0)
      setDecks([...decks].sort((a,b)=>a.rating>b.rating ? -1:1));
    else
      setDecks([...decks].sort((a,b)=>a.rating>b.rating ? 1:-1));
  }

  // Arrange decks in order of number of cards
  const changeCountOrder = () => {

    setAlpha(2);
    setRatingAsc(2);
    setViewsAsc(2)

    if (isCountAsc === 2)
      setCountAsc(0);
    else
      setCountAsc(isCountAsc ^ 1);

    if (isCountAsc === 0)
      setDecks([...decks].sort((a,b)=>a.size>b.size ? -1:1));
    else
      setDecks([...decks].sort((a,b)=>a.size>b.size ? 1:-1));
  }

  // Arrange decks in order of number of views
  const changeViewsOrder = () => {

    setAlpha(2);
    setRatingAsc(2);
    setCountAsc(2);

    if (isViewsAsc === 2)
      setViewsAsc(0);
    else
      setViewsAsc(isViewsAsc ^ 1);

    if (isViewsAsc === 0)
      setDecks([...decks].sort((a,b)=>a.views>b.views ? -1:1));
    else
      setDecks([...decks].sort((a,b)=>a.views>b.views ? 1:-1));
  }

  const changePage = (event) => {
    navigate("/flashcards", {state:{id:event.target.getAttribute("id"), deckName:event.target.getAttribute("value")}});
  }

  const goNext = () => {
    if (counter + 12 <= decks.length)
      setCounter(counter + 12);
  }

  const goPrevious = () => {
    if (counter - 12 < 0)
      setCounter(0);
    else
      setCounter(counter - 12);
  }

  useEffect(() => {
    document.body.className = styles.deck_body;
    const root = document.getElementById('root');
    root.style.cssText = "height: 100%;";
    getDecks();
  }, [])

  const deckList = decks.filter(element=>element.deck_name.toLowerCase().includes(search) &&
                                          element.creator.toLowerCase().includes(creator))
                        .slice(counter,counter + 12)
                        .map(deck => <div key={deck.id}
                                      id={deck.id}
                                      value={deck.deck_name}
                                      onClick={changePage} 
                                      className={styles.decks_deck}>{deck.deck_name}
                                      <br/>Created by {deck.creator}
                                      <br/>{deck.rating} &#9733;
                                      <br/>{deck.size} cards
                                      <br/>{deck.views} views
                                      </div>);

  if (!isLoggedIn)
    return <Redirect />;

  return (
    <main className={styles.decks_main}>
      <div className={styles.decks_filter}>
        Deck name: <input type="text" 
                 name="decks_search" 
                 className={styles.decks_search} 
                 onChange={e => setSearch(e.target.value.toLowerCase())}/>&nbsp;&nbsp;
        Creator: <input type="text" 
                 name="creator_search" 
                 className={styles.decks_search} 
                 onChange={e => setCreator(e.target.value.toLowerCase())}/>&nbsp;&nbsp;
        {isAlpha === 0 ? (
          <span onClick={changeAlphaOrder}>A-Z &#9650;&nbsp;&nbsp;</span>
        ) : isAlpha === 1 ? (
          <span onClick={changeAlphaOrder}>A-Z &#9660;&nbsp;&nbsp;</span>
        ) : (
          <span onClick={changeAlphaOrder}>A-Z &#9644;&nbsp;&nbsp;</span>
        )}
        {isRatingAsc === 0 ? (
          <span onClick={changeRatingOrder}>Ratings &#9650;&nbsp;&nbsp;</span>
        ) : isRatingAsc === 1 ? (
          <span onClick={changeRatingOrder}>Ratings &#9660;&nbsp;&nbsp;</span>
        ) : (
          <span onClick={changeRatingOrder}>Ratings &#9644;&nbsp;&nbsp;</span>
        )}
        {isCountAsc === 0 ? (
          <span onClick={changeCountOrder}>Size &#9650;&nbsp;&nbsp;</span>
        ) : isCountAsc === 1 ? (
          <span onClick={changeCountOrder}>Size &#9660;&nbsp;&nbsp;</span>
        ) : (
          <span onClick={changeCountOrder}>Size &#9644;&nbsp;&nbsp;</span>
        )}
        {isViewsAsc === 0 ? (
          <span onClick={changeViewsOrder}>View &#9650;&nbsp;&nbsp;</span>
        ) : isViewsAsc === 1 ? (
          <span onClick={changeViewsOrder}>View &#9660;&nbsp;&nbsp;</span>
        ) : (
          <span onClick={changeViewsOrder}>View &#9644;&nbsp;&nbsp;</span>
        )}
      </div>
      <div className={styles.decks_container} >
        {deckList}
      </div>
      <div className={styles.decks_button_container}>
          <div onClick={goNext} className={styles.decks_next}>NEXT</div>
          <div onClick={goPrevious} className={styles.decks_previous}>PREVIOUS</div>
      </div>
    </main>
  );

}

export default Decks;