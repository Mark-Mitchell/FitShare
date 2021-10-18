import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Button } from "react-native";
import { Input } from "react-native-magnus";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { apiURL } from "../../../assets/config/api.config";
import { getAccessToken } from "../../auth/accessToken";
import getUserInfo from "../../auth/getUserInfo";

import GlobalStyles from "../../../assets/styling/GlobalStyles";
import WorkoutComponent from "./WorkoutComponent";
import Loading from "../../Loading";

function DownloadUnlistedWorkout(props) {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userInfo: undefined,
    loggedIn: true,
  });

  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [workout, setWorkout] = useState(null);

  const checkIfLoggedIn = async () => {
    setLoading(true);
    const apiUserInfo = await getUserInfo();
    if (!apiUserInfo.loggedIn) {
      return props.navigation.navigate("Profile");
    }
    setUserInfo(apiUserInfo);
    setLoading(false);
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const fetchSlug = async () => {
    if (slug.length < 6 || isNaN(slug.charAt(3)))
      return setError("Please provide a valid ID.");

    checkIfLoggedIn();

    if (userInfo.loggedIn) {
      try {
        const token = await getAccessToken();

        const response = await fetch(apiURL + "api/unlistedWorkout/download", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            slug,
          }),
        });
        const json = await response.json();

        if (json.message.includes("TokenExpiredError")) {
          setError("Please login again, the token has expired.");
          return props.navigation.navigate("Profile");
        } else if (json.message.includes("InvalidID")) {
          return setError("Please provide a valid ID.");
        } else if (json.message.includes("ERROR")) {
          return setError(json.message);
        } else {
          const jsonWorkout = JSON.parse(json.workout.workout);
          const output = {
            ...jsonWorkout,
            generalInfo: {
              ...jsonWorkout.generalInfo,
              slug: json.workout.slug,
              creator: json.workout.userId,
              creatorUsername: json.workout.creatorUsername,
            },
          };
          setWorkout(output);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      return props.navigation.navigate("Profile");
    }

    setError("");
  };

  return (
    <>
      {!loading ? (
        <>
          {!!error && <Text style={GlobalStyles.errorText}>{error}</Text>}
          <Input
            prefix={
              <MaterialCommunityIcons name="magnify" size={18} color="gray" />
            }
            placeholder="Workout ID"
            value={slug}
            onChangeText={(text) => setSlug(text)}
            fontSize={18}
            style={GlobalStyles.defaultInput}
          />
          <TouchableOpacity
            style={GlobalStyles.defaultButton}
            onPress={() => fetchSlug()}
          >
            <Text style={GlobalStyles.defaultButtonText}>
              Search & Download
            </Text>
          </TouchableOpacity>
          {!!workout && (
            <WorkoutComponent
              key={slug}
              navigation={props.navigation}
              id={slug}
              workout={workout}
              onlineWorkout={true}
            />
          )}
        </>
      ) : (
        <Loading moreInfo="Trying to log you in." />
      )}
    </>
  );
}

export default DownloadUnlistedWorkout;
