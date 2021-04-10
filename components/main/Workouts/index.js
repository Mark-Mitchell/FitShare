import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";

function Workout(props) {
  useEffect(() => {
    console.log(props.navigation);
  }, []);

  return (
    <View>
      <Text>Workouts</Text>
      <Button
        title="Navigate to Landing"
        onPress={() => props.navigation.navigate("Landing")}
      />
    </View>
  );
}

export default Workout;
