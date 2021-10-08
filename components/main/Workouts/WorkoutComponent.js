import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";

import { useSelector } from "react-redux";

import formatTime from "../../../assets/styling/formatTime";
import { lightBackgroundColor } from "../../../assets/styling/GlobalColors";
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
          style={styles.container}
        >
          <View style={styles.content}>
            <Image
              source={require("../../../images/WIP.jpg")}
              style={styles.image}
            />
            <View styles={styles.info}>
              <Text style={styles.title}>Name:</Text>
              <Text>
                {props.workout.generalInfo.title} ({props.id})
              </Text>
              <Text style={styles.title}>Description:</Text>
              <Text>
                {props.workout.generalInfo.description
                  ? props.workout.generalInfo.description
                  : "\n"}
              </Text>
              <Text style={styles.title}>Estimated Time:</Text>
              <Text>
                {formatTime(calculateWorkoutTime(props.workout, exercises))}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    height: "auto",
    width: "35%",
  },
  content: {
    flexDirection: "row",
    paddingLeft: 10,
  },
  info: {
    paddingLeft: 20,
  },
  container: {
    padding: 10,
    backgroundColor: lightBackgroundColor,
  },
  title: {
    fontWeight: "bold",
  },
});

export default WorkoutComponent;
