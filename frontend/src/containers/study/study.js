import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/session";
import axios from "axios";
import CSRF from "../../components/csrfGetter";
import Redirect from "../../components/redirect";

import styles from "./study.module.css";

function Study({route,navigation}) {
  const isLoggedIn = useSelector(selectUser);
  const [decks, setDecks] = useState([]);
  const [counter, setCounter] = useState(0);
  const [deckId, setDeckId] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const csrfRef = useRef(null);
  const { state } = useLocation();
  const { id } = state || {id:-1};

  const getDecks = () => {
    console.log(id);
    axios.get("/history", {
      params: {user:id}
    })
     .then((response) => {
        console.log(response);
        setDecks([...response.data.decks].sort((a,b)=>a.timestamp>b.timestamp?-1:1));
     });
  }

  const handleDeckLink = (event) => {
    var deck_id = event.target.getAttribute("value");
    setDeckId(deck_id);
  }

  const changePage = (event) => {
    navigate("/flashcards", {state:{id:event.target.getAttribute("id"), deckName:event.target.getAttribute("value")}});
  }

  const goNext = () => {
    if (counter + 12 <= decks.length)
      setCounter(counter + 12);
    setDeckId("");
  }

  const goPrevious = () => {
    if (counter - 12 < 0)
      setCounter(0);
    else
      setCounter(counter - 12);
    setDeckId("");
  }

  useEffect(() => {
    console.log(id);
    document.body.className = styles.deck_body;
    const root = document.getElementById('root');
    root.style.cssText = "height: 100%;";
    getDecks();
  }, [])

  const deckList = decks.filter(element=>element.deck_name.toLowerCase().includes(search))
                        .slice(counter,counter + 12)
                        .map(deck => <div key={deck.id}
                                      id={deck.id}
                                      value={deck.deck_name}
                                      className={styles.decks_deck}
                                      onClick={changePage} >{deck.deck_name}<br/>
                                      {new Date(deck.timestamp).toLocaleDateString('en-GB', {hourCycle: "h23", hour:"2-digit", minute:"2-digit"})}
                                      </div>);

  if (!isLoggedIn)
    return <Redirect />;

  return (
    <main className={styles.decks_main}>
      <div className={styles.search}>
        Search: <input type="text" name="decks_search" className={styles.decks_search}
                  onChange={e => setSearch(e.target.value.toLowerCase())}/>
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

export default Study;