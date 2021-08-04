import React from "react";
import {} from "react-native";
import Exercises from "../../Exercises";

function ExercisePicker(props) {
  return <Exercises navigation={props.navigation} exerciseSelectable={true} />;
}

export default ExercisePicker;
