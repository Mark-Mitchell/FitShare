import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { apiURL } from "../../assets/config/api.config";

import commonPassword from "common-password";
import GlobalStyles from "../../assets/styling/GlobalStyles";
import { Input } from "react-native-magnus";
import Loading from "../Loading";

function Register(props) {
  const [loading, setLoading] = useState(false);
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
      errors.push(
        <Text key="noUsername" style={GlobalStyles.errorText}>
          Please provide a username.
        </Text>
      );
    if (!email)
      errors.push(
        <Text key="noEmail" style={GlobalStyles.errorText}>
          Please provide an email.
        </Text>
      );
    if (!password)
      errors.push(
        <Text key="noPassword" style={GlobalStyles.errorText}>
          Please provide a password.
        </Text>
      );

    if (password.length < 8) {
      errors.push(
        <Text key="shortPassword" style={GlobalStyles.errorText}>
          Your password is too short. Please use a password that is at least 8
          characters long.
        </Text>
      );
    } else {
      if (commonPassword(password))
        errors.push(
          <Text key="common-password" style={GlobalStyles.errorText}>
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
        <Text key="invalid-email" style={GlobalStyles.errorText}>
          Your email is invalid. Please use a valid email address.
        </Text>
      );

    setSubmitErrors(errors);

    // if input is okay send input to API
    if (errors.length === 0) {
      setLoading(true);
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
            email: email.toLocaleLowerCase(),
          }),
        });
        let json = await response.json();
        if (json.message.includes("ERROR")) {
          setSubmitSuccess(null);
          setSubmitErrors(
            <Text style={GlobalStyles.errorText}>{json.message}</Text>
          );
        } else {
          setSubmitErrors(null);
          setSubmitSuccess(
            <Text style={GlobalStyles.successText}>{json.message}</Text>
          );
        }
        setLoading(false);
        return;
      } catch (err) {
        setLoading(false);
        console.log("HERE" + err);
      }
    }
  };

  return (
    <>
      {!loading ? (
        <>
          {submitErrors}
          {submitSuccess}
          <Input
            prefix={
              <>
                <MaterialCommunityIcons name="human" size={18} />
                <Text> Username</Text>
              </>
            }
            fontSize={18}
            style={GlobalStyles.defaultInput}
            value={username}
            onChangeText={(input) => setUsername(input)}
          />
          <Input
            prefix={
              <>
                <MaterialCommunityIcons name="email" size={18} />
                <Text> Email</Text>
              </>
            }
            fontSize={18}
            style={GlobalStyles.defaultInput}
            placeholder="Email Address"
            value={email}
            onChangeText={(input) => setEmail(input)}
            keyboardType="email-address"
          />
          <Input
            prefix={
              <>
                <MaterialCommunityIcons
                  name="eye-check"
                  size={18}
                  onPress={() => setHidePassword((prevState) => !prevState)}
                />
                <Text> Password</Text>
              </>
            }
            fontSize={18}
            style={GlobalStyles.defaultInput}
            placeholder="Password"
            value={password}
            onChangeText={(input) => setPassword(input)}
            secureTextEntry={hidePassword}
          />

          <TouchableOpacity
            onPress={() => props.navigation.navigate("Profile")}
          >
            <Text
              style={[
                GlobalStyles.link,
                { textAlign: "center", paddingTop: 10 },
              ]}
            >
              Already have an account? Login here.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={GlobalStyles.defaultButton}
            onPress={() => register()}
          >
            <Text style={GlobalStyles.defaultButtonText}>Register</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Loading moreInfo="Registering a new account..." />
      )}
    </>
  );
}

export default Register;
