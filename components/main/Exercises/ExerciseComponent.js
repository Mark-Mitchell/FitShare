import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  Pressable,
  Platform,
  TouchableOpacity,
} from "react-native";

import { useSelector } from "react-redux";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import formatTime from "../../../assets/styling/formatTime";
import getEquipmentIcons from "./getEquipmentIcons";
import DeleteExercise from "./DeleteExercise";

import {
  defaultColor,
  lightBackgroundColor,
} from "../../../assets/styling/GlobalColors";
import GlobalStyles from "../../../assets/styling/GlobalStyles";
import { getRandomWorkoutImg } from "../../../assets/global functions/getRandomWorkoutImg";

function ExerciseComponent(props) {
  const exercises = useSelector((state) => state.exercises);
  const defaultExercises = useSelector((state) => state.defaultExercises);

  const isDefaultExercise = JSON.stringify(props.id).includes("d");

  const exercise = isDefaultExercise
    ? defaultExercises[props.id]
    : exercises[props.id];

  const isNextExerciseInWorkout = !(
    props.hasOwnProperty("hideControls") && props.hideControls
  );
  // toggling the full exercise information
  const [selected, setSelected] = useState(
    isNextExerciseInWorkout ? false : true
  );

  // get default image when on web or none was provided
  const imageUri = exercise.image
    ? isDefaultExercise
      ? exercise.image
      : Platform.OS !== "web"
      ? { uri: exercise.image }
      : getRandomWorkoutImg()
    : getRandomWorkoutImg();

  // get all equipnment icons
  const equipmentComponents = getEquipmentIcons(exercise.equipment);

  // Toggle background colour after a long press to select exercise (to create a workout)
  const handleLongPress = (id) => {
    props.exerciseSelectable ? props.selectExercise(id) : null;
  };

  const containerStyle = {
    flexDirection: "row",
    backgroundColor:
      props.hasOwnProperty("selectedExercises") &&
      props.selectedExercises.includes(props.id)
        ? defaultColor
        : lightBackgroundColor,
    padding: 5,
    margin: 10,
    marginBottom: 0,
    height: !!(
      isNextExerciseInWorkout &&
      !props.exerciseSelectable &&
      !props.workout &&
      !selected
    )
      ? 100
      : "auto",
    borderRadius: 10,
  };

  const handlePress = () => {
    props.workout ? null : setSelected(!selected);
  };

  const editExercise = (id) => {
    props.navigation.navigate("EditExercise", { id, isEditing: true });
  };

  return (
    <Pressable
      style={containerStyle}
      onPress={() => handlePress()}
      onLongPress={() => handleLongPress(props.id)}
    >
      {
        // order in list for createWorkout
        props.reordable && (
          <View>
            <Pressable onPress={() => props.openModal(props.currentIndex)}>
              <MaterialCommunityIcons
                name="arrow-up-down-bold-outline"
                size={20}
              />
              <Text>{props.currentIndex}</Text>
            </Pressable>
          </View>
        )
      }

      <View style={styles.imgContainer}>
        <Image source={imageUri} style={styles.img} />
      </View>
      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.title,
            {
              fontSize: 20,
              color:
                props.hasOwnProperty("selectedExercises") &&
                props.selectedExercises.includes(props.id)
                  ? "white"
                  : "black",
            },
          ]}
        >
          {exercise.name}
        </Text>

        {selected && (
          <>
            <View>
              {!!exercise.description && (
                <>
                  <Text style={styles.title}>Description:</Text>
                  <Text style={styles.description}>{exercise.description}</Text>
                </>
              )}

              {exercise.time !== -1 && (
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.title}>Time: </Text>
                  <Text>{formatTime(exercise.time)}</Text>
                </View>
              )}
              {exercise.reps !== -1 && (
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.title}>Reps: </Text>
                  <Text>{exercise.reps}</Text>
                </View>
              )}

              {!!exercise.moreInfo && (
                <>
                  <Text style={styles.title}>More Information:</Text>
                  <Text>{exercise.moreInfo}</Text>
                </>
              )}
              {/* <Text>
              Drop Sets: {exercise.dropSets ? "Yes" : "No"}
            </Text> */}
              {equipmentComponents && equipmentComponents.length !== 0 && (
                <>
                  <Text style={styles.title}>Equipment Required:</Text>
                  <View style={styles.equipmentContainer}>
                    {equipmentComponents}
                  </View>
                </>
              )}
            </View>
            {!!(
              isNextExerciseInWorkout &&
              !props.exerciseSelectable &&
              !props.workout &&
              !isDefaultExercise
            ) && (
              <View>
                <TouchableOpacity
                  style={GlobalStyles.optionButton}
                  onPress={() => editExercise(props.id)}
                >
                  <MaterialCommunityIcons name="pencil" size={18} />
                  <Text style={GlobalStyles.optionButtonText}>Edit</Text>
                </TouchableOpacity>

                <DeleteExercise
                  id={props.id}
                  workout={props.reordable ? true : false}
                  removeItemFromList={props.removeItemFromList}
                  currentIndex={props.currentIndex}
                />
              </View>
            )}
          </>
        )}

        {props.workout && (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                props.handleRepsPress(props.index, props.reps);
              }}
            >
              <Text>
                Repetitions: {props.reps} x{" "}
                {exercise.time === -1
                  ? exercise.reps + " reps"
                  : formatTime(exercise.time)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                props.handleTimePress(
                  "between_sets",
                  props.index,
                  props.timeBetweenSets
                );
              }}
            >
              <Text>
                Time Between Sets: {formatTime(props.timeBetweenSets)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                props.handleTimePress(
                  "after_exercise",
                  props.index,
                  props.timeAfterExercise
                );
              }}
            >
              <Text>
                Time After Exercise: {formatTime(props.timeAfterExercise)}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Play / Delete Buttons */}
      {isNextExerciseInWorkout && (
        <>
          {!props.exerciseSelectable && (
            <>
              <View style={styles.playButtonContainer}>
                <MaterialCommunityIcons
                  name="play-outline"
                  size={30}
                  onPress={() =>
                    props.navigation.navigate("PlayExercise", {
                      id: props.id,
                      name: exercise.name,
                      defaultExercise: isDefaultExercise,
                    })
                  }
                />
                {props.reordable && (
                  <MaterialCommunityIcons
                    name="alpha-x-circle-outline"
                    size={30}
                    onPress={() => props.removeItemFromList(props.currentIndex)}
                  />
                )}
              </View>
            </>
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
  },

  description: {
    fontStyle: "italic",
  },

  equipmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  imgContainer: {
    flexDirection: "row",
    flex: 4,
  },

  contentContainer: {
    flex: 6,
  },

  img: {
    aspectRatio: 4 / 3,
    width: "90%",
    height: undefined,
    borderRadius: 10,
    margin: 3,
  },

  playButtonContainer: {
    alignSelf: "center",
  },

  deleteButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignSelf: "center",
  },
});

export default ExerciseComponent;
