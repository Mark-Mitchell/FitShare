import React from "react";
import { Text, Pressable } from "react-native";

import { useSelector } from "react-redux";

import formatTime from "../../../assets/styling/formatTime";
import calculateWorkoutTime from "./calculateWorkoutTime";

function WorkoutComponent(props) {
  const exercises = useSelector((state) => state.exercises);
  return (
    <>
      {props.workout.hasOwnProperty("generalInfo") && (
        <Pressable
          onPress={() =>
            props.navigation.navigate("WorkoutPage", {
              workout: props.workout,
            })
          }
        >
          <Text>
            Name: {props.workout.generalInfo.title} ({props.id})
          </Text>
          <Text>Description: {props.workout.generalInfo.description}</Text>
          <Text>
            Time: {formatTime(calculateWorkoutTime(props.workout, exercises))}
          </Text>
        </Pressable>
      )}
    </>
  );
}

export default WorkoutComponent;
