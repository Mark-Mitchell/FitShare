import React from "react";
import { SafeAreaView } from "react-native";

import GlobalStyles from "../../../assets/GlobalStyles";
import EditExercise from "./EditExercise";

function Create(props) {
  return (
    <SafeAreaView style={GlobalStyles.screenContainer}>
      <EditExercise navigation={props.navigation} />
    </SafeAreaView>
  );
}

export default Create;
