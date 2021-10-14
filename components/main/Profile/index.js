import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Platform, Button, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as SecureStore from "expo-secure-store";

import Test from "./Test";
import Register from "../../auth/Register";
import Login from "../../auth/Login";
import { removeAccessToken } from "../../auth/accessToken";
import { useDispatch } from "react-redux";
import { fetchLocalData, fetchLocalWorkouts } from "../../../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import checkNetworkConnection from "../../../assets/global functions/checkNetworkConnection";

function Profile() {
  const dispatch = useDispatch();

  const [hasConnection, setHasConnection] = useState(undefined);
  const [isdeviceSupported, setIsDeviceSupported] = useState(undefined);

  const getNetworkState = async () => {
    const internetReachable = await checkNetworkConnection();
    setHasConnection(internetReachable);
  };

  const getSupportedDeviceInfo = async () => {
    const secureStoreInfo = await SecureStore.isAvailableAsync();
    const isSupported = secureStoreInfo ? true : Platform.OS === "web";
    setIsDeviceSupported(isSupported);
  };

  const logout = async () => {
    removeAccessToken();
  };

  // check if device has connection and has SecureStoreInfo
  useEffect(() => {
    getNetworkState();
    getSupportedDeviceInfo();
  }, []);

  const deleteAll = async (type) => {
    const newState = {};
    if (type === "exercises") {
      // Remove from Redux
      dispatch(fetchLocalData(newState));

      // Remove from Local Storage
      try {
        await AsyncStorage.setItem("exercises", JSON.stringify(newState));
      } catch (error) {
        console.log(error);
      }
    } else if (type === "workouts") {
      // Remove from Redux
      dispatch(fetchLocalWorkouts(newState));

      // Remove from Local Storage
      try {
        await AsyncStorage.setItem("workouts", JSON.stringify(newState));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {isdeviceSupported ? (
          <>
            {!hasConnection && (
              <>
                <Text style={styles.error}>
                  ERROR: Please check your connection and try again.
                </Text>
              </>
            )}

            <Text>Connection: {hasConnection ? "yes" : "no"}</Text>
            <Text>Supported Device: {isdeviceSupported ? "yes" : "no"}</Text>
            <Test />
            <Register />
            <Login />
            <Button title="Logout" onPress={() => logout()} />
            <Button
              title="Delete All Exercises"
              onPress={() => deleteAll("exercises")}
            />
            <Button
              title="Delete All Workouts"
              onPress={() => deleteAll("workouts")}
            />
          </>
        ) : (
          <>
            <Text style={styles.error}>
              Sorry we currently don't support your device to create an account,
              however you can keep using our app without an account!
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
  },
});

export default Profile;
