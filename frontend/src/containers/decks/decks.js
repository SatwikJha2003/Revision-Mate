import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/session";
import axios from "axios";
import CSRF from "../../components/csrfGetter";
import Redirect from "../../components/redirect";

import styles from "./decks.module.css";

function Decks() {
  const isLoggedIn = useSelector(selectUser);
  const [decks, setDecks] = useState([]);
  const [counter, setCounter] = useState(0);
  const [deckId, setDeckId] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const csrfRef = useRef(null);

  const getDecks = () => {
    axios.get("/decks")
     .then((response) => {
        setDecks([...response.data]);
     });
  }

  const handleDeckLink = (event) => {
    var deck_id = event.target.getAttribute("value");
    setDeckId(deck_id);
  }

  const handleForm = (event) => {
    event.preventDefault();
    if (event.nativeEvent.submitter.name === "create_button") {
      var formData = new FormData(event.target);
      formData.append("deck_id", deckId);
      axios.post("/share/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": formData.get("csrf-token")
        }
      }).then(response=>console.log(response));
    }
    setDeckId("");
  }

  const changePage = (event) => {
    navigate("/flashcards", {state: {deckName:event.target.getAttribute("value")}});
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
    document.body.className = styles.deck_body;
    const root = document.getElementById('root');
    root.style.cssText = "height: 100%;";
    getDecks();
  }, [])

  const deckList = decks.slice(counter,counter + 12)
                        .map(deck => <div key={deck.id}
                                      onClick={changePage} 
                                      value={deck.id}
                                      className={styles.decks_deck}>{deck.deck_name}
                                      </div>);

  if (!isLoggedIn)
    return <Redirect />;

  return (
    <main className={styles.decks_main}>
      Search: <input type="text" name="decks_search" className={styles.decks_search} 
      onChange={e => setSearch(e.target.value.toLowerCase())}/>
      {deckId && (
        <form id="download_form" className={styles.download_form} onSubmit={handleForm}>
          <CSRF />
          <label className={styles.download_label} htmlFor="deck_name">Enter the name you wish to save the deck as:&nbsp;</label>
          <input type="text" name="deck_name" className={styles.download_input}/>
          <div className={styles.download_buttons_container}>
            <button type="submit" className={styles.download_submits} name="create_button">
              <span className={styles.download_span}>Submit</span>
            </button>
            <button type="submit" className={styles.download_submits} name="cancel_button">
              <span className={styles.download_span}>Cancel</span>
            </button>
          </div>
        </form>
      )}
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