import React, { useEffect } from "react";
import { Text, Button, SafeAreaView } from "react-native";

import GlobalStyles from "../../../assets/GlobalStyles";

function Workout(props) {
  useEffect(() => {
    console.log(props.navigation);
  }, []);

  return (
    <SafeAreaView style={GlobalStyles.screenContainer}>
      <Text>Workouts</Text>
      <Button
        title="Navigate to Landing"
        onPress={() => props.navigation.navigate("Landing")}
      />
    </SafeAreaView>
  );
}

export default Workout;
