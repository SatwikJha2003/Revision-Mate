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
import Share from "./containers/share/share";
import NavBar from "./components/navbar";

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
            <Route path="/share" element={<Share />} />
            <Route path="/logout" element={<Logout />}/>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App;