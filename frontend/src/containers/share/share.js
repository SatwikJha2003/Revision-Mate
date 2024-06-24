import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/manageAccount";
import axios from "axios";
import CSRF from "../../components/csrfGetter";
import Redirect from "../../components/redirect";

import styles from "./share.module.css";

function Share() {
  const isLoggedIn = useSelector(selectUser);
  const [decks, setDecks] = useState([]);
  const [deckName, setDeckName] = useState("");
  const csrfRef = useRef(null);

  const getDecks = () => {
    axios.get("/share")
     .then((response) => {
        setDecks([...response.data]);
     });
  }

  const handleDeckLink = (event) => {
    var deck_id = event.target.getAttribute("value");
    var formData = new FormData();
    formData.append("deck_id", deck_id);
    formData.append("deck_name", "testing1");
    axios.post("/share/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": csrfRef.current.value
      }
    });
  }

  useEffect(() => {
    getDecks();
  }, [])

  const deckList = decks.map(deck => <li key={deck.id}
                                    onClick={handleDeckLink} 
                                    value={deck.id}
                                    className={(deckName === deck.deck_name ? styles.deck_selected:styles.deck)}
                                   >{deck.deck_name}</li>);

  if (!isLoggedIn)
    return <Redirect />;

  return (
    <main className={styles.summary_main}>
      <CSRF ref={csrfRef}/>
      <div className={styles.flashcards_list}>
        <ul>{deckList}</ul>
      </div>
    </main>
  );

}

export default Share;