import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Input } from "react-native-magnus";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { saveAccessToken } from "./accessToken";
import getUserInfo from "./getUserInfo";
import { apiURL } from "../../assets/config/api.config";
import GlobalStyles from "../../assets/styling/GlobalStyles";
import Loading from "../Loading";

function Login(props) {
  const [loading, setLoading] = useState(false);
  const [submitErrors, setSubmitErrors] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const login = async () => {
    let errors = [];

    if (!email)
      errors.push(
        <Text style={GlobalStyles.errorText} key="noEmail">
          Please provide an email.
        </Text>
      );
    if (!password)
      errors.push(
        <Text style={GlobalStyles.errorText} key="noPassword">
          Please provide a password.
        </Text>
      );

    setSubmitErrors(errors);

    // send login req to API if no errors
    if (errors.length === 0) {
      try {
        setLoading(true);
        console.log(email);
        console.log(password);

        let response = await fetch(apiURL + "api/auth/signin", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLocaleLowerCase(),
            password,
          }),
        });
        let json = await response.json();

        if (!json.accessToken) {
          setLoading(false);
          return setSubmitErrors(
            <Text style={GlobalStyles.errorText} key="json-error">
              Your provided input is not correct. Please check your password and
              email address.
            </Text>
          );
        } else {
          const saveToken = await saveAccessToken(json.accessToken);

          // if saveAccessToken() return an error display it else show success message
          if (saveToken) {
            setLoading(false);
            return setSubmitErrors(
              <Text style={GlobalStyles.errorText}>{saveToken}</Text>
            );
          } else {
            props.setUserInfo(await getUserInfo());
            setLoading(false);
            return setSubmitSuccess(
              <Text style={GlobalStyles.successText}>
                You have successfully logged in.
              </Text>
            );
          }
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
  };

  return (
    <>
      {!loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            alignContent: "center",
            height: "100%",
            width: "90%",
            widt: 300,
          }}
        >
          <View>
            {submitErrors}
            {submitSuccess}
            <Input
              fontSize={18}
              prefix={<MaterialCommunityIcons name="email" size={18} />}
              style={GlobalStyles.defaultInput}
              placeholder="Email Address"
              value={email}
              onChangeText={(input) => setEmail(input)}
              keyboardType="email-address"
            />
            <Input
              prefix={
                <MaterialCommunityIcons
                  name="eye-check"
                  size={18}
                  onPress={() => setHidePassword((prevState) => !prevState)}
                />
              }
              fontSize={18}
              style={GlobalStyles.defaultInput}
              placeholder="Password"
              value={password}
              onChangeText={(input) => setPassword(input)}
              secureTextEntry={hidePassword}
            />

            <TouchableOpacity
              onPress={() => props.navigation.navigate("Register")}
            >
              <Text
                style={[
                  GlobalStyles.link,
                  { textAlign: "center", paddingTop: 10 },
                ]}
              >
                Don't have an account yet? Register here.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => props.navigation.navigate("ForgotPassword")}
            >
              <Text
                style={[
                  GlobalStyles.link,
                  { textAlign: "center", paddingTop: 10 },
                ]}
              >
                Forgot your password? Reset it here.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => login()}
              style={GlobalStyles.defaultButton}
            >
              <Text style={GlobalStyles.defaultButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Loading moreInfo="Logging you in..." />
      )}
    </>
  );
}

export default Login;
