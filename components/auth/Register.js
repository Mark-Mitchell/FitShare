import React, { useState } from "react";
import { Button, TextInput, Text } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitErrors, setSubmitErrors] = useState([]);

  const register = async () => {
    let errors = [];
    // check user input if valid
    if (!username)
      errors.push(<Text key="noUsername">Please provide a username.</Text>);
    if (!email)
      errors.push(<Text key="noEmail">Please provide an email.</Text>);
    if (!password)
      errors.push(<Text key="noPassword">Please provide a password.</Text>);
    // todo check if email is valid with Regex
    // TODO: PASSWORD REQS

    setSubmitErrors(errors);

    // if input is okay send input to API
    if (errors.length === 0) {
      try {
        let response = await fetch(
          "https://fitshare-api.herokuapp.com/api/auth/signup",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              password,
              email,
            }),
          }
        );
        let json = await response.json();
        if (json.message.includes("ERROR")) {
          setSubmitSuccess(null);
          setSubmitErrors(<Text>{json.message}</Text>);
        } else {
          setSubmitErrors(null);
          setSubmitSuccess(<Text>{json.message}</Text>);
        }
        return console.log(json);
      } catch (err) {
        console.log("HERE" + err);
      }
    }
  };

  return (
    <>
      {submitErrors}
      {submitSuccess}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(input) => setUsername(input)}
      />
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={(input) => setEmail(input)}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(input) => setPassword(input)}
        secureTextEntry={hidePassword}
      />
      <MaterialCommunityIcons
        name="eye-check"
        size={30}
        onPress={() => setHidePassword((prevState) => !prevState)}
      />
      <Button title="Register" onPress={() => register()} />
    </>
  );
}

export default Register;
