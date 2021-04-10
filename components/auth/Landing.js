import React from "react";
import { View, Button } from "react-native";

function Landing(props) {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button
        title="Login"
        onPress={() => props.navigation.navigate("Login")}
      />
      <Button
        title="Register"
        onPress={() => props.navigation.navigate("Register")}
      />
    </View>
  );
}

export default Landing;
