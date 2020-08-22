import React, { Fragment, useState, useEffect } from "react"
import { Auth } from 'aws-amplify'

// Utility for retrieving Cognito user information.
const useUserUtil = () => {

  const [username, setUsername] = useState("name");
  const [pinboardKey, setPinboardKey] = useState("");

  useEffect(() => {
    const getUsername = async () => {

      const currentUserInfo = await Auth.currentUserInfo();
      console.log(currentUserInfo);
      setUsername(currentUserInfo.username);
      setPinboardKey(currentUserInfo.attributes["custom:pinboardKey"]);
    }
    getUsername();
  }, []);

  return [username, pinboardKey];
}

export default useUserUtil;
