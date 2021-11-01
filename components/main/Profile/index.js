import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as SecureStore from "expo-secure-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useDispatch } from "react-redux";
import { fetchLocalData, fetchLocalWorkouts } from "../../../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Login from "../../auth/Login";
import ProfilePage from "./ProfilePage";

import checkNetworkConnection from "../../../assets/global functions/checkNetworkConnection";
import getUserInfo from "../../auth/getUserInfo";
import Loading from "../../Loading";
import GlobalStyles from "../../../assets/styling/GlobalStyles";

function Profile(props) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [hasConnection, setHasConnection] = useState(undefined);
  const [isdeviceSupported, setIsDeviceSupported] = useState(undefined);

  const [userInfo, setUserInfo] = useState({
    loggedIn: false,
  });

  const getNetworkState = async () => {
    const internetReachable = await checkNetworkConnection();
    setHasConnection(internetReachable);
  };

  const getSupportedDeviceInfo = async () => {
    const secureStoreInfo = await SecureStore.isAvailableAsync();
    const isSupported = secureStoreInfo ? true : Platform.OS === "web";
    setIsDeviceSupported(isSupported);
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

  const checkIfLoggedIn = async () => {
    setLoading(true);
    const apiUserInfo = await getUserInfo();
    if (!apiUserInfo.loggedIn) {
      setLoading(false);
      return props.navigation.navigate("Profile");
    }
    setUserInfo(apiUserInfo);
    setLoading(false);
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  return (
    <SafeAreaView>
      {!loading ? (
        <ScrollView>
          {!!(userInfo.hasOwnProperty("loggedIn") && userInfo.loggedIn) ? (
            <ProfilePage
              setUserInfo={setUserInfo}
              user={userInfo.user}
              navigation={props.navigation}
            />
          ) : (
            <>
              {isdeviceSupported ? (
                <>
                  {!hasConnection && (
                    <>
                      <Text style={styles.error}>
                        ERROR: Please check your connection and try again.
                      </Text>
                    </>
                  )}

                  {!isdeviceSupported && (
                    <>
                      <Text style={styles.error}>
                        ERROR: Your device doesn't seem to be supported to use
                        the online features. Try to restart your device and
                        check again. If this persists you can still freely use
                        the other parts of the app!
                      </Text>
                    </>
                  )}

                  <Login
                    navigation={props.navigation}
                    setUserInfo={setUserInfo}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.error}>
                    Sorry we currently don't support your device to create an
                    account, however you can keep using our app without an
                    account!
                  </Text>
                </>
              )}
            </>
          )}

          <TouchableOpacity
            onPress={() => props.navigation.navigate("AppInfo", { deleteAll })}
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <MaterialCommunityIcons
              name="information"
              size={14}
              style={{ marginRight: 5 }}
            />
            <Text>About the App (Information, Support, Feedback)</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <Loading moreInfo="Trying to log you in..." />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
  },
});

export default Profile;
