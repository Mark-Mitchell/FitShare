import React from "react";
import { View, Text } from "react-native";
import EditExercise from "./EditExercise";

function Create(props) {
  return (
    <View>
      <Text>Create</Text>
      <EditExercise navigation={props.navigation} />
    </View>
  );
}

export default Create;
