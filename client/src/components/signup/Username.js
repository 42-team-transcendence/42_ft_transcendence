import React, { useRef, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

const Username = ({ user, setUser, validName, setValidName, userFocus, setUserFocus }) => {
  const userRef = useRef();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  return (
    <>
      <label htmlFor="username">
        Username:
        <span className={validName ? "valid" : "hide"}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
        <span className={validName || !user ? "hide" : "invalid"}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </label>
      <input
        type="text"
        id="username"
        ref={userRef}
        autoComplete="off"
        onChange={(e) => setUser(e.target.value)}
        value={user}
        required
        onFocus={() => setUserFocus(true)}
        onBlur={() => setUserFocus(false)}
      />
      <p className={userFocus && user && !validName ? "instructions" : "offscreen"}>
        <FontAwesomeIcon icon={faInfoCircle} />
        4 to 24 characters.<br/>
        Must begin with a letter.<br/>
        Letters, numbers, underscores, hyphens allowed
      </p>
    </>
  );
};

export default Username;