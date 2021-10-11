import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import Timer from "./Timer";
import getEquipmentIcons from "../main/Exercises/getEquipmentIcons";
import { useSelector } from "react-redux";

function PlayExercise(props) {
  const exercises = useSelector((state) => state.exercises);
  const initialId = props.hasOwnProperty("id")
    ? props.id
    : props.route.params.id;
  const [id, setId] = useState(initialId);
  const [exercise, setExercise] = useState(exercises[initialId]);
  const [isTimedExercise, setIsTimedExercise] = useState(exercise.reps === -1);

  const isWorkout = props.hasOwnProperty("workout") && props.workout;
  const { name, description, reps, time, moreInfo, equipment } = exercise;

  useEffect(() => {
    if (isWorkout) {
      setTimerDurataion(exercises[props.id].time);
      setId(props.id);
      setExercise(exercises[props.id]);
      setIsTimedExercise(exercises[props.id].reps === -1);
    }
  }, [props.id]);

  const [timerPlaying, setTimerPlaying] = useState(true);
  const [timerDuration, setTimerDurataion] = useState(exercise.time);
  // When key is changed, the timer resets
  const [timerKey, setTimerKey] = useState(0);

  const imageUri =
    exercise.image && Platform.OS !== "web"
      ? { uri: exercise.image }
      : require("../../images/WIP.jpg");

  const equipmentComponents = getEquipmentIcons(equipment, 30);

  const exerciseCompleted = () => {
    isWorkout ? props.nextExercise() : console.log("WORKOUT IS COMPLETED");
  };

  return (
    <ScrollView>
      {exercise.time > 0 && (
        <Timer
          playing={timerPlaying}
          duration={timerDuration}
          key={timerKey}
          onComplete={() => exerciseCompleted()}
        />
      )}

      <Text style={styles.title}>Name:</Text>
      <Text>{name}</Text>
      <Text>{description}</Text>
      {/* <Text>{exercise.equipment}</Text> */}
      <Text style={styles.title}>Exercise Type: </Text>
      <Text>{reps === -1 ? "Time: " + time : "Reps: " + reps}</Text>
      <Text>{moreInfo}</Text>
      <Text style={styles.title}>Required Equipment:</Text>
      <View style={styles.equipmentContainer}>{equipmentComponents}</View>
      {/* <Text>{exercise.info.reps}</Text>
      <Text>{exercise.info.time}</Text> */}

      {/* <View style={styles.imgContainer}>
        <Image source={imageUri} style={styles.img} />
      </View> */}

      <MaterialCommunityIcons
        name="reload"
        size={50}
        onPress={() => setTimerKey(timerKey + 1)}
      />
      <MaterialCommunityIcons
        name={timerPlaying ? "pause" : "play-outline"}
        size={50}
        onPress={() => setTimerPlaying(!timerPlaying)}
      />
      {isWorkout && (
        <MaterialCommunityIcons
          name="skip-previous"
          size={50}
          color={props.minReached ? "grey" : "black"}
          onPress={() => props.previousExercise()}
        />
      )}
      <MaterialCommunityIcons
        name={isTimedExercise && isWorkout ? "skip-forward" : "check"}
        size={50}
        onPress={() =>
          isWorkout ? exerciseCompleted() : console.log("COMPLETE")
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    flexDirection: "row",
    flex: 1 / 5,
    marginRight: 10,
  },

  img: {
    width: 300,
    height: 300,
  },

  title: {
    fontWeight: "bold",
  },

  equipmentContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
  },
});

export default PlayExercise;
