import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Input } from "react-native-magnus";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { apiURL } from "../../../assets/config/api.config";
import GlobalStyles from "../../../assets/styling/GlobalStyles";
import Loading from "../../Loading";
import { getAccessToken } from "../../auth/accessToken";

function UpdateUsername() {
  const [loading, setLoading] = useState(false);
  const [submitErrors, setSubmitErrors] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    let errors = null;
    if (!username)
      errors = (
        <Text style={GlobalStyles.errorText} key="noUsername">
          Please provide a username.
        </Text>
      );

    setSubmitErrors(errors);
    if (!errors) {
      try {
        setLoading(true);

        const token = await getAccessToken();

        let response = await fetch(apiURL + "api/user/update-username/", {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            username,
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
            <Text
              style={{ textAlign: "center", fontSize: 14, fontStyle: "italic" }}
            >
              You can update your username here. The username will be changed
              immediately, however the change will only be shown in the app when
              you restart it.
            </Text>
            <Input
              fontSize={18}
              prefix={<MaterialCommunityIcons name="human" size={18} />}
              style={GlobalStyles.defaultInput}
              placeholder="Username"
              value={username}
              onChangeText={(input) => setUsername(input)}
            />

            {!submitSuccess && (
              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={GlobalStyles.defaultButton}
              >
                <Text style={GlobalStyles.defaultButtonText}>
                  Update Username
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <Loading moreInfo="Updating your username..." />
      )}
    </>
  );
}

export default UpdateUsername;
