import React, { useState } from "react";
import { Button, TextInput, Text } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { apiURL } from "../../assets/config/api.config";

import commonPassword from "common-password";

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

    if (password.length < 8) {
      errors.push(
        <Text key="shortPassword">
          Your password is too short. Please use a password that is at least 8
          characters long.
        </Text>
      );
    } else {
      if (commonPassword(password))
        errors.push(
          <Text key="common-password">
            Your password is too easy to guess. Please try another password.
          </Text>
        );
    }

    function validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    if (!validateEmail(email))
      errors.push(
        <Text key="invalid-email">
          Your email is invalid. Please use a valid email address.
        </Text>
      );

    setSubmitErrors(errors);

    // if input is okay send input to API
    if (errors.length === 0) {
      try {
        let response = await fetch(apiURL + "api/auth/signup", {
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
        });
        let json = await response.json();
        if (json.message.includes("ERROR")) {
          setSubmitSuccess(null);
          setSubmitErrors(<Text>{json.message}</Text>);
        } else {
          setSubmitErrors(null);
          setSubmitSuccess(<Text>{json.message}</Text>);
        }
        return;
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
