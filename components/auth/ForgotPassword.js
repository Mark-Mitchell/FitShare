import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Input } from "react-native-magnus";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { apiURL } from "../../assets/config/api.config";
import GlobalStyles from "../../assets/styling/GlobalStyles";
import Loading from "../Loading";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [submitErrors, setSubmitErrors] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [email, setEmail] = useState("");

  const resetPassword = async () => {
    let errors = [];

    if (!email)
      errors.push(
        <Text style={GlobalStyles.errorText} key="noEmail">
          Please provide an email.
        </Text>
      );

    setSubmitErrors(errors);

    // send login req to API if no errors
    if (errors.length === 0) {
      try {
        setLoading(true);

        let response = await fetch(apiURL + "api/auth/forgot-password/", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLocaleLowerCase(),
          }),
        });
        let json = await response.json();

        if (json.message.includes("SUCCESS")) {
          setSubmitSuccess(
            <Text style={GlobalStyles.successText}>{json.message}</Text>
          );
        } else {
          setSubmitErrors(
            <Text style={GlobalStyles.errorText}>{json.message}</Text>
          );
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
            <Text style={{ textAlign: "center", fontSize: 14 }}>
              Enter your email you registered your account with. You will then
              be sent a link where you will be able to chose a new password.
            </Text>
            <Input
              fontSize={18}
              prefix={<MaterialCommunityIcons name="email" size={18} />}
              style={GlobalStyles.defaultInput}
              placeholder="Email Address"
              value={email}
              onChangeText={(input) => setEmail(input)}
              keyboardType="email-address"
            />

            {!submitSuccess && (
              <TouchableOpacity
                onPress={() => resetPassword()}
                style={GlobalStyles.defaultButton}
              >
                <Text style={GlobalStyles.defaultButtonText}>
                  Reset Password
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <Loading moreInfo="Logging you in..." />
      )}
    </>
  );
}

export default ForgotPassword;
