import React, { useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react"
import axios from "axios";
import store from "./store";
import "@fontsource/nunito-sans";

import Login from "./containers/login/login";
import Register from "./containers/register/register";
import Logout from "./containers/logout/logout";
import Flashcards from "./containers/flashcards/flashcards";
import Deck from "./containers/deck/deck";
import Summary from "./containers/summary/summary";
import Decks from "./containers/decks/decks";
import Create from "./containers/create/create";
import Study from "./containers/study/study";
import Recall from "./containers/recall/recall";
import Friend from "./containers/friend/friend";
import NavBar from "./components/navbar/navbar";
import Friends from "./components/friends/friends"

function App() {
  var persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/deck" element={<Deck />} /> 
            <Route path="/summary" element={<Summary />} />
            <Route path="/logout" element={<Logout />}/>
            <Route path="/decks" element={<Decks />}/>
            <Route path="/create" element={<Create />}/>
            <Route path="/study" element={<Study />}/>
            <Route path="/friend" element={<Friend />}/>
            <Route path="/recall" element={<Recall />}/>
          </Routes>
          <Friends />
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App;