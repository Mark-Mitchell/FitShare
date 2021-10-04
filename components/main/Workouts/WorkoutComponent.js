import React from "react";
import { Text, Pressable } from "react-native";
import formatTime from "../../../assets/styling/formatTime";

function WorkoutComponent(props) {
  return (
    <Pressable
      onPress={() =>
        props.navigation.navigate("WorkoutPage", { workout: props.workout })
      }
    >
      <Text>
        Name: {props.workout.generalInfo.title} ({props.id})
      </Text>
      <Text>Description: {props.workout.generalInfo.description}</Text>
      <Text>Time: {formatTime(props.workout.generalInfo.totalTime)}</Text>
    </Pressable>
  );
}

export default WorkoutComponent;
