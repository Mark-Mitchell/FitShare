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

import { lightBackgroundColor } from "../../../assets/styling/GlobalColors";

function ExerciseComponent(props) {
  const exercises = useSelector((state) => state.exercises);

  const isNextExerciseInWorkout = !(
    props.hasOwnProperty("hideControls") && props.hideControls
  );
  // toggling the full exercise information
  const [selected, setSelected] = useState(
    isNextExerciseInWorkout ? false : true
  );

  // get default image when on web or none was provided
  const imageUri =
    props.image && Platform.OS !== "web"
      ? { uri: props.image }
      : require("../../../images/WIP.jpg");

  // get all equipnment icons
  const equipmentComponents = getEquipmentIcons(exercises[props.id].equipment);

  // Toggle background colour after a long press to select exercise (to create a workout)
  const handleLongPress = (id) => {
    props.exerciseSelectable ? props.selectExercise(id) : null;
  };

  const containerStyle = {
    flexDirection: "row",
    backgroundColor: props.selectedPicker ? "blue" : lightBackgroundColor,
    padding: 5,
    margin: 5,
    height: 100,
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
      // onLongPress={() => handleLongPress(props.exercise.id)}
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
        <Text style={styles.title}>{exercises[props.id].name}</Text>

        <View style={styles.equipmentContainer}>{equipmentComponents}</View>

        {selected && (
          <View>
            <Text style={styles.title}>Exercise Information:</Text>

            <Text>Description:</Text>
            <Text style={styles.description}>
              {exercises[props.id].description}
            </Text>

            {exercises[props.id].time !== -1 && (
              <Text>Time: {exercises[props.id].time}</Text>
            )}
            {exercises[props.id].reps !== -1 && (
              <Text>Reps: {exercises[props.id].reps}</Text>
            )}

            <Text>More Information:</Text>
            <Text>{exercises[props.id].moreInfo}</Text>
            <Text>
              Drop Sets: {exercises[props.id].dropSets ? "Yes" : "No"}
            </Text>
          </View>
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
                {exercises[props.id].time === -1
                  ? exercises[props.id].reps + " reps"
                  : formatTime(exercises[props.id].time)}
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
                    })
                  }
                />
              </View>
              {/* Show delete button when its not displayed in a workout */}
              {props.workout ? null : (
                <View style={styles.deleteButtonContainer}>
                  {!props.reordable && (
                    <Pressable onPress={() => editExercise(props.id)}>
                      <MaterialCommunityIcons name="pencil" size={40} />
                    </Pressable>
                  )}
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
    // justifyContent: "space-between",
    alignItems: "center",
  },

  imgContainer: {
    flexDirection: "row",
    flex: 3,
    marginRight: 10,
  },

  contentContainer: {
    flex: 6,
  },

  img: {
    aspectRatio: 3 / 2,
    width: "100%",
    height: undefined,
    // height: "100%",
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
