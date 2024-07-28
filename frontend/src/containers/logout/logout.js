import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/session";
import axios from "axios";
import Redirect from "../../components/redirect";

function Logout() {

  const dispatch = useDispatch();

  const getCSRF = () => {
    let cookieValue = null;
    /*Code referenced directly from official Django docs*/
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0,10) === ('csrftoken=')) {
          cookieValue = decodeURIComponent(cookie.substring(10));
          return cookieValue;
        }
      }
    }
  }

  useEffect(() => {
    const session = JSON.stringify({'withCredentials': true});
    axios.post("/logout/", session,{
      headers: {
        "X-CSRFToken": getCSRF(),
      }
    }).then(dispatch(logout()));
  }, []);

  return <Redirect />;
}

export default Logout;