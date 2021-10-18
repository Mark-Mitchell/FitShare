import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import Timer from "./Timer";
import getEquipmentIcons from "../main/Exercises/getEquipmentIcons";
import { useSelector } from "react-redux";
import formatTime from "../../assets/styling/formatTime";
import { getRandomWorkoutImg } from "../../assets/global functions/getRandomWorkoutImg";

function PlayExercise(props) {
  const exercises = useSelector((state) => state.exercises);
  const defaultExercises = useSelector((state) => state.defaultExercises);
  const initialId = props.hasOwnProperty("id")
    ? props.id
    : props.route.params.id;
  const [id, setId] = useState(initialId);

  const [isDefaultExercise, setIsDefaultWorkout] = useState(
    JSON.stringify(id).includes("d")
  );

  const [exercise, setExercise] = useState(
    isDefaultExercise ? defaultExercises[initialId] : exercises[initialId]
  );
  const [isTimedExercise, setIsTimedExercise] = useState(
    isDefaultExercise
      ? defaultExercises[initialId] === -1
      : exercises[initialId] === -1
  );

  const isWorkout = props.hasOwnProperty("workout") && props.workout;
  const { name, description, reps, time, moreInfo, equipment } = exercise;

  useEffect(() => {
    const newId = props.hasOwnProperty("id") ? props.id : props.route.params.id;
    const tempIsDefaultWorkout = JSON.stringify(newId).includes("d");
    setIsDefaultWorkout(tempIsDefaultWorkout);
    if (isWorkout && !tempIsDefaultWorkout) {
      setTimerDurataion(exercises[newId].time);
      setId(newId);
      setExercise(exercises[newId]);
      setIsTimedExercise(exercises[newId].reps === -1);
    } else if (isWorkout && tempIsDefaultWorkout) {
      setTimerDurataion(defaultExercises[newId].time);
      setId(props.id);
      setExercise(defaultExercises[newId]);
      setIsTimedExercise(defaultExercises[newId].reps === -1);
    }
  }, [props.id]);

  const [timerPlaying, setTimerPlaying] = useState(true);
  const [timerDuration, setTimerDurataion] = useState(exercise.time);
  // When key is changed, the timer resets
  const [timerKey, setTimerKey] = useState(0);

  const imageUri = exercise.image
    ? isDefaultExercise
      ? exercise.image
      : Platform.OS !== "web"
      ? { uri: exercise.image }
      : getRandomWorkoutImg()
    : getRandomWorkoutImg();

  const equipmentComponents = getEquipmentIcons(equipment, 60);

  const exerciseCompleted = () => {
    isWorkout ? props.nextExercise() : console.log("WORKOUT IS COMPLETED");
  };

  return (
    <ScrollView style={{ flexDirection: "column" }}>
      <View
        style={{
          alignSelf: "center",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 22,
            textAlign: "center",
            marginVertical: 10,
          }}
        >
          {name}
        </Text>

        <Image source={imageUri} style={styles.img} />

        {!!isWorkout && (
          <View style={{ flexDirection: "row", alignContent: "space-between" }}>
            <View style={{ width: "50%" }}>
              <Text
                style={{
                  fontSize: 12,
                  fontStyle: "italic",
                }}
              >
                Sets: {props.currentSetInfo}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontStyle: "italic",
                }}
              >
                Exercise: {props.currentExerciseInfo}
              </Text>
            </View>
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
            alignContent: "space-between",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isWorkout && (
            <>
              <MaterialCommunityIcons
                name="skip-previous"
                size={50}
                color={props.minReached ? "grey" : "black"}
                onPress={() => props.previousExercise()}
              />
            </>
          )}
          {exercise.time > 0 && (
            <>
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
            </>
          )}

          <MaterialCommunityIcons
            name={isTimedExercise && isWorkout ? "skip-forward" : "check"}
            size={50}
            onPress={() =>
              isWorkout ? exerciseCompleted() : props.navigation.popToTop()
            }
          />
        </View>

        {exercise.time > 0 && (
          <Timer
            playing={timerPlaying}
            duration={timerDuration}
            key={timerKey}
            onComplete={() => exerciseCompleted()}
          />
        )}

        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {reps === -1 ? "Duration: " : "Repetitions: "}
          </Text>
          <Text style={{ fontSize: 18 }}>
            {reps === -1 ? formatTime(time) : reps}
          </Text>
        </View>

        {!!description && (
          <>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Description:
            </Text>
            <Text style={{ fontSize: 18, fontStyle: "italic" }}>
              {description}
            </Text>
          </>
        )}

        {!!moreInfo && (
          <>
            <Text style={{ fontSize: 18 }}>More Information:</Text>
            <Text style={{ fontSize: 18, fontStyle: "italic" }}>
              {moreInfo}
            </Text>
          </>
        )}

        {equipmentComponents.length !== 0 && (
          <>
            <Text style={styles.title}>Required Equipment:</Text>
            <View style={styles.equipmentContainer}>{equipmentComponents}</View>
          </>
        )}

        <Text
          style={{
            fontSize: 12,
            fontStyle: "italic",
            textAlign: "center",
            marginVertical: 20,
          }}
        >
          Let's get to work!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imgContainer: {},

  img: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").width * 0.8,
    borderRadius: 10,
  },

  title: {
    fontWeight: "bold",
    fontSize: 18,
  },

  equipmentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    flexWrap: "wrap",
    width: Dimensions.get("window").width * 0.8,
  },
});

export default PlayExercise;
