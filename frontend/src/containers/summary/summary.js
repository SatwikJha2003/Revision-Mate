import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/manageAccount";
import axios from "axios";
import CSRF from "../../components/csrfGetter";
import Redirect from "../../components/redirect";

import styles from "./summary.module.css";

function Summary() {
  const isLoggedIn = useSelector(selectUser);
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("CHOOSE FILE");
  const [fileText, setFileText] = useState("");
  const [summaryText, setSummaryText] = useState("");

  const handleChange = (event) => {
    if(event.target.files[0])
      setFileName(event.target.files[0].name);
    else
      setFileName("CHOOSE FILE");
  }

  const handleForm = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    axios.post("/summary/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": formData.get("csrf-token")
      }
    }).then(response => {
      setFileText(response.data[0]);
      setSummaryText(response.data[1]);
    });
  }

  useEffect(() => {
    document.body.className = styles.summary_body;
  })

  if (!isLoggedIn)
    return <Redirect />;

  return (
    <main className={styles.summary_main}>
      <form id="summary_form" className={styles.summary_form} onSubmit={handleForm}>
        <CSRF />
        <label className={styles.summary_label} htmlFor="file_name">{fileName}</label>
        <input 
          type="file" 
          name="file_name" 
          id="file_name" 
          className={styles.summary_input}
          onChange={handleChange}/><br/>
        <button type="submit" className={styles.summary_submit}>
          <span className={styles.summary_span}>UPLOAD</span>
        </button>
      </form>
      <div className={styles.text_container}>
        <div className={(fileText ? styles.file_text:styles.none)}>{fileText}</div>
        <div className={(summaryText ? styles.summary_text:styles.none)}>{summaryText}</div>
      </div>
    </main>
  );

}

export default Summary;