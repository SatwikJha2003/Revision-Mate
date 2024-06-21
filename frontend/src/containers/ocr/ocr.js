import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/manageAccount";
import axios from "axios";
import CSRF from "../../components/csrfGetter";
import Redirect from "../../components/redirect";

import styles from "./ocr.module.css";

function OCR() {
  const isLoggedIn = useSelector(selectUser);
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("CHOOSE FILE");
  const [imageText, setImageText] = useState("");

  const handleChange = (event) => {
    if(event.target.files[0])
      setFileName(event.target.files[0].name);
    else
      setFileName("CHOOSE FILE");
  }

  const handleForm = (event) => {
    event.preventDefault();
    var formData = new FormData(event.target);
    axios.post("/ocr/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": formData.get("csrf-token")
      }
    }).then(response => {
      setImageText(response.data);
    });
  }

  useEffect(() => {
    document.body.className = styles.ocr_body;
  })

  if (!isLoggedIn)
    return <Redirect />;

  return (
    <main className={styles.ocr_main}>
      <form id="ocr_form" className={styles.ocr_form} onSubmit={handleForm}>
        <CSRF />
        <label className={styles.ocr_label} htmlFor="file_name">{fileName}</label>
        <input 
          type="file" 
          name="file_name" 
          id="file_name" 
          className={styles.ocr_input}
          onChange={handleChange}/><br/>
        <button type="submit" className={styles.ocr_submit}>
          <span className={styles.ocr_span}>UPLOAD</span>
        </button>
      </form>
      <div className={styles.image_text}>{imageText}</div>
    </main>
  );

}

export default OCR;