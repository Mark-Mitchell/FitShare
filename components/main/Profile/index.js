import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Platform } from "react-native";

import * as SecureStore from "expo-secure-store";
import * as Network from "expo-network";

import Test from "./Test";
import Register from "../../auth/Register";
import Login from "../../auth/Login";

function Profile() {
  const [hasConnection, setHasConnection] = useState(undefined);
  const [isdeviceSupported, setIsDeviceSupported] = useState(undefined);

  const getNetworkState = async () => {
    const netWorkStatus = await Network.getNetworkStateAsync();
    setHasConnection(netWorkStatus.isInternetReachable);
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

  return (
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

          <Text>Connection: {hasConnection ? "yes" : "no"}</Text>
          <Text>Supported Device: {isdeviceSupported ? "yes" : "no"}</Text>
          <Test />
          <Register />
          <Login />
        </>
      ) : (
        <>
          <Text style={styles.error}>
            Sorry we currently don't support your device to create an account,
            however you can keep using our app without an account!
          </Text>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
  },
});

export default Profile;
