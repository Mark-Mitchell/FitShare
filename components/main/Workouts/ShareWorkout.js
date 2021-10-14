import React, { useEffect, useState } from "react";
import { Text, Button, View, Switch, StyleSheet } from "react-native";

import { fetchLocalWorkouts } from "../../../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSelector, useDispatch } from "react-redux";

import getUserInfo from "../../auth/getUserInfo";
import { apiURL } from "../../../assets/config/api.config";
import { getAccessToken } from "../../auth/accessToken";
import checkNetworkConnection from "../../../assets/global functions/checkNetworkConnection";

function ShareWorkout(props) {
  const workout = props.route.params.workout;
  const id = workout.generalInfo.id;

  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState({
    userInfo: undefined,
    loggedIn: false,
  });
  const isWorkoutSharedByUser = !!(
    workout.generalInfo.hasOwnProperty("slug") && workout.generalInfo.slug
  );
  const [idShare, setIdShare] = useState(isWorkoutSharedByUser);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [isConnected, setIsConnected] = useState(null);

  const checkIfLoggedIn = async () => {
    const apiUserInfo = await getUserInfo();
    if (apiUserInfo.loggedIn) {
      console.log(apiUserInfo.success);
    } else {
      console.log(apiUserInfo.error);
      return props.navigation.navigate("Profile");
    }
    setUserInfo(apiUserInfo);
  };

  const checkInternet = async () => {
    const internetReachable = await checkNetworkConnection();
    setIsConnected(internetReachable);
  };

  useEffect(() => {
    checkInternet();
    checkIfLoggedIn();
  }, []);

  const handleSave = async () => {
    await checkIfLoggedIn();

    if (!userInfo.loggedIn) {
      return props.navigation.navigate("Profile");
    }

    const isOnline = !!(
      workout.generalInfo.hasOwnProperty("slug") && workout.generalInfo.slug
    );
    if (isOnline) {
      if (workout.generalInfo.creator === userInfo.user.id) {
        if (idShare) {
          return setError(
            "This workout has already been shared. To update the online version please re-share it."
          );
        }
      } else {
        return setError(
          "You are not the creator of this workout and therefore can't upload it."
        );
      }
    }

    if (idShare && userInfo.loggedIn) {
      const token = await getAccessToken();

      try {
        let response = await fetch(apiURL + "api/unlistedWorkout/upload", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            workout: JSON.stringify(workout),
            userId: userInfo.user.id,
          }),
        });
        let json = await response.json();

        if (json.message.includes("NoWorkout")) {
          setError("Please provide an ID to download a workout.");
        } else if (json.message.includes("NoUserId")) {
          return setError(
            "Please check your connection, restart your app and try again."
          );
        } else if (json.message.includes("ERROR")) {
          return setError(json.message);
        } else if (json.message.includes("SUCCESS")) {
          saveWorkout(json.slug, json.creator, json.creatorUsername);
          setSuccess("You have successfully saved the workout.");
          return props.navigation.popToTop();
        } else {
          return setError(
            "An unexpected error has occured. Please check your connection, restart the app and try again."
          );
        }
      } catch (err) {
        console.log(err);
      }
    } else if (userInfo.loggedIn && isOnline) {
      if (
        !workout.generalInfo.hasOwnProperty("slug") &&
        !workout.generalInfo.slug
      )
        return console.log("DO NOTHING, NOT SHARED");

      // Delete the workout from the db
      const token = await getAccessToken();

      try {
        let response = await fetch(apiURL + "api/unlistedWorkout/delete", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            slug: workout.generalInfo.slug,
            userId: userInfo.user.id,
          }),
        });
        let json = await response.json();

        if (json.message.includes("NoSlug")) {
          setError("Please provide an slug to delete the workout.");
        } else if (json.message.includes("NoUserId")) {
          return setError(
            "Please check your connection, restart your app and try again."
          );
        } else if (json.message.includes("WrongSlug")) {
          saveWorkout();
          setError(
            "Please check your connection, restart your app and try again."
          );
          return props.navigation.popToTop();
        } else if (json.message.includes("ERROR")) {
          return setError(json.message);
        } else if (json.message.includes("SUCCESS")) {
          saveWorkout(json.slug, json.creator);
          saveWorkout();
          setSuccess("You have successfully deleted the workout.");
          return props.navigation.popToTop();
        } else {
          return setError(
            "An unexpected error has occured. Please check your connection, restart your device and try again."
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const reduxWorkouts = useSelector((state) => state.workouts);
  const saveWorkout = async (slug = "", creator = "", username = "") => {
    const newState = {
      ...reduxWorkouts,
      [id]: {
        ...workout,
        generalInfo: {
          ...workout.generalInfo,
          slug: slug,
          creator: creator,
          creatorUsername: username,
        },
      },
    };

    dispatch(fetchLocalWorkouts(newState));

    // save to LocalStorage
    try {
      await AsyncStorage.setItem("workouts", JSON.stringify(newState));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!isConnected ? (
        <>
          <Text>Please connect to the intenet.</Text>
        </>
      ) : (
        <>
          {userInfo.hasOwnProperty("error") && userInfo.error && (
            <Text>{userInfo.error}</Text>
          )}
          {!!error && <Text>{error}</Text>}

          {userInfo.hasOwnProperty("success") && userInfo.success && (
            <Text>{userInfo.success}</Text>
          )}
          {!!(success || error) && <Text>{success}</Text>}

          {!success && (
            <>
              <Text>Share Workout Page</Text>
              {userInfo.hasOwnProperty("loggedIn") && userInfo.loggedIn && (
                <>
                  <View style={styles.switch}>
                    <Text>Share this Workout by ID</Text>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={idShare ? "#f5dd4b" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() =>
                        setIdShare((prevState) => !prevState)
                      }
                      value={idShare}
                      style={{ marginLeft: 10, marginRight: 10 }}
                    />
                    {/* <Text>Create Workout</Text> */}
                  </View>
                  <Button title="Save" onPress={() => handleSave()} />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  switch: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export default ShareWorkout;
