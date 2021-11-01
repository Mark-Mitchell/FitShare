import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Input } from "react-native-magnus";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { apiURL } from "../../../assets/config/api.config";
import GlobalStyles from "../../../assets/styling/GlobalStyles";
import Loading from "../../Loading";
import { getAccessToken } from "../../auth/accessToken";

function UpdateEmail() {
  const [loading, setLoading] = useState(false);
  const [submitErrors, setSubmitErrors] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  const sendConfirmationEmail = async () => {
    try {
      setLoading(true);

      const token = await getAccessToken();

      let response = await fetch(apiURL + "api/user/send-verification-email/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({}),
      });
      let json = await response.json();

      if (!json.message.includes("SUCCESS")) {
        return setSubmitErrors(
          <Text style={GlobalStyles.errorText}>{json.message}</Text>
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    let errors = [];

    if (!email)
      errors.push(
        <Text style={GlobalStyles.errorText} key="noEmail">
          Please provide an email.
        </Text>
      );
    if (!confirmEmail)
      errors.push(
        <Text style={GlobalStyles.errorText} key="noEmail">
          Please repeat your email address in the second input box.
        </Text>
      );
    if (confirmEmail !== email) {
      errors.push(
        <Text style={GlobalStyles.errorText} key="noEmail">
          Please check your input, the provided email addresses do not match.
        </Text>
      );
    }

    setSubmitErrors(errors);

    // send login req to API if no errors
    if (errors.length === 0) {
      try {
        setLoading(true);

        const token = await getAccessToken();

        let response = await fetch(apiURL + "api/user/update-email/", {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            email: email.toLocaleLowerCase(),
          }),
        });
        let json = await response.json();

        if (json.message.includes("SUCCESS")) {
          sendConfirmationEmail();
          if (!submitErrors || submitErrors.length === 0) {
            console.log("success");
            setSubmitSuccess(
              <Text style={GlobalStyles.successText}>{json.message}</Text>
            );
          } else {
            console.log("ERRORS?");
            console.log(submitErrors);
          }
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
            <Text
              style={{ textAlign: "center", fontSize: 14, fontStyle: "italic" }}
            >
              You can update your email address here. Your old email will be
              removed from your account and the new one added. You will have to
              confirm your new email address. The email will be changed
              immediately, however the change will only be shown in the app when
              you restart it.
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

            <Input
              fontSize={18}
              prefix={<MaterialCommunityIcons name="email" size={18} />}
              style={GlobalStyles.defaultInput}
              placeholder="Confirm Your Email Address"
              value={confirmEmail}
              onChangeText={(input) => setConfirmEmail(input)}
              keyboardType="email-address"
            />

            {!submitSuccess && (
              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={GlobalStyles.defaultButton}
              >
                <Text style={GlobalStyles.defaultButtonText}>Update Email</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <Loading moreInfo="Updating your email..." />
      )}
    </>
  );
}

export default UpdateEmail;
