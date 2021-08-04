import React from "react";
import { View, Text, Button } from "react-native";

function EditWorkout(props) {
  return (
    <View>
      <Text>Edit Workout</Text>
      <Button
        title="Add Exercise"
        onPress={() => props.navigation.navigate("ExercisePicker")}
      />
    </View>
  );
}

export default EditWorkout;
