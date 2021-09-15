import React from "react";
import { View, Text, Button } from "react-native";

import ReordableList from "./ReordableList";

function EditWorkout(props) {
  return (
    <View>
      <Text>Edit Workout</Text>
      <Button
        title="Add Exercise"
        onPress={() => props.navigation.navigate("ExercisePicker")}
      />
      <ReordableList navigation={props.navigation} />
    </View>
  );
}

export default EditWorkout;
