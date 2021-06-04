import React from "react";
import { SafeAreaView } from "react-native";
import EditExercise from "./EditExercise";

function Create(props) {
  return (
    <SafeAreaView>
      <EditExercise navigation={props.navigation} />
    </SafeAreaView>
  );
}

export default Create;
