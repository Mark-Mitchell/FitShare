import React from "react";
import { Text, SafeAreaView } from "react-native";
import EditExercise from "./EditExercise";

function Create(props) {
  return (
    <SafeAreaView>
      <Text>Create</Text>
      <EditExercise navigation={props.navigation} />
    </SafeAreaView>
  );
}

export default Create;
