import React, { useState } from "react";
import { TextInput, Button, Text } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { saveAccessToken } from "./accessToken";

function Login() {
  const [submitErrors, setSubmitErrors] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const login = async () => {
    let errors = [];

    if (!email)
      errors.push(<Text key="noEmail">Please provide an email.</Text>);
    if (!password)
      errors.push(<Text key="noPassword">Please provide a password.</Text>);

    setSubmitErrors(errors);

    // send login req to API if no errors
    if (errors.length === 0) {
      try {
        let response = await fetch(
          "https://fitshare-api.herokuapp.com/api/auth/signin",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
              // email: "testingmail",
            }),
          }
        );
        let json = await response.json();

        if (!json.accessToken) {
          return setSubmitErrors(<Text>{json.message}</Text>);
        } else {
          const saveToken = await saveAccessToken(json.accessToken);

          // if saveAccessToken() return an error display it else show success message
          if (saveToken) {
            return setSubmitErrors(<Text>{saveToken}</Text>);
          } else {
            return setSubmitSuccess(
              <Text>You have successfully logged in.</Text>
            );
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {submitErrors}
      {submitSuccess}
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
      <Button title="Login" onPress={() => login()} />
    </>
  );
}

export default Login;
