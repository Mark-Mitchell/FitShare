import React, { useState, useEffect } from "react";
import { TextInput, Button, Text } from "react-native";

import { apiURL } from "../../../assets/config/api.config";
import { getAccessToken } from "../../auth/accessToken";
import getUserInfo from "../../auth/getUserInfo";

import WorkoutComponent from "./WorkoutComponent";

function DownloadUnlistedWorkout(props) {
  const [userInfo, setUserInfo] = useState({
    userInfo: undefined,
    loggedIn: false,
  });

  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [workout, setWorkout] = useState(null);

  const checkIfLoggedIn = async () => {
    const apiUserInfo = await getUserInfo();

    if (!apiUserInfo.loggedIn) {
      return props.navigation.navigate("Profile");
    }
    setUserInfo(apiUserInfo);
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
      {error && <Text>{error}</Text>}
      <TextInput
        placeholder="Workout ID"
        value={slug}
        onChangeText={(text) => setSlug(text)}
      />
      <Button title="Search & Download" onPress={() => fetchSlug()} />
      {workout && (
        <WorkoutComponent
          key={slug}
          navigation={props.navigation}
          id={slug}
          workout={workout}
          onlineWorkout={true}
        />
      )}
    </>
  );
}

export default DownloadUnlistedWorkout;
