import React, { useEffect, useState } from "react";
import { Text, View, Switch, StyleSheet, TouchableOpacity } from "react-native";

import { fetchLocalWorkouts } from "../../../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSelector, useDispatch } from "react-redux";

import getUserInfo from "../../auth/getUserInfo";
import { apiURL } from "../../../assets/config/api.config";
import { getAccessToken } from "../../auth/accessToken";
import checkNetworkConnection from "../../../assets/global functions/checkNetworkConnection";
import Loading from "../../Loading";
import GlobalStyles from "../../../assets/styling/GlobalStyles";

function ShareWorkout(props) {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const apiUserInfo = await getUserInfo();
    if (apiUserInfo.loggedIn) {
      console.log(apiUserInfo.success);
    } else {
      console.log(apiUserInfo.error);
      setLoading(false);
      return props.navigation.navigate("Profile");
    }
    setUserInfo(apiUserInfo);
    setLoading(false);
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
      setLoading(true);
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
          setLoading(false);
          return setError(
            "Please check your connection, restart your app and try again."
          );
        } else if (json.message.includes("ERROR")) {
          setLoading(false);
          return setError(json.message);
        } else if (json.message.includes("SUCCESS")) {
          saveWorkout(json.slug, json.creator, json.creatorUsername);
          setSuccess("You have successfully saved the workout.");
          setLoading(false);
          return props.navigation.popToTop();
        } else {
          setLoading(false);
          return setError(
            "An unexpected error has occured. Please check your connection, restart the app and try again."
          );
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    } else if (userInfo.loggedIn && isOnline) {
      if (
        !workout.generalInfo.hasOwnProperty("slug") &&
        !workout.generalInfo.slug
      )
        return console.log("DO NOTHING, NOT SHARED");

      // Delete the workout from the db
      setLoading(true);
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
          setLoading(false);
          return setError(
            "Please check your connection, restart your app and try again."
          );
        } else if (json.message.includes("WrongSlug")) {
          saveWorkout();
          setError(
            "Please check your connection, restart your app and try again."
          );
          setLoading(false);
          return props.navigation.popToTop();
        } else if (json.message.includes("ERROR")) {
          setLoading(false);
          return setError(json.message);
        } else if (json.message.includes("SUCCESS")) {
          saveWorkout(json.slug, json.creator);
          saveWorkout();
          setSuccess("You have successfully deleted the workout.");
          setLoading(false);
          return props.navigation.popToTop();
        } else {
          setLoading(false);
          return setError(
            "An unexpected error has occured. Please check your connection, restart your device and try again."
          );
        }
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
      setLoading(false);
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
      {!loading ? (
        <>
          {!isConnected ? (
            <>
              <Text style={GlobalStyles.errorText}>
                Please connect to the intenet.
              </Text>
            </>
          ) : (
            <>
              {userInfo.hasOwnProperty("error") && userInfo.error && (
                <Text style={GlobalStyles.errorText}>{userInfo.error}</Text>
              )}
              {!!error && <Text style={GlobalStyles.errorText}>{error}</Text>}

              {userInfo.hasOwnProperty("success") && userInfo.success && (
                <Text style={GlobalStyles.successText}>{userInfo.success}</Text>
              )}
              {!!(success || error) && (
                <Text style={GlobalStyles.successText}>{success}</Text>
              )}

              {!success && (
                <>
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
                      </View>
                      <TouchableOpacity
                        style={GlobalStyles.defaultButton}
                        onPress={() => handleSave()}
                      >
                        <Text style={GlobalStyles.defaultButtonText}>
                          Save Selection
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <Loading />
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
