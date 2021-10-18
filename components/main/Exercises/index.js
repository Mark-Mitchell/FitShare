import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Button,
  TouchableOpacity,
  Text,
  Switch,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector, useDispatch } from "react-redux";
import GlobalStyles from "../../../assets/styling/GlobalStyles";
import { fetchSelectedExercises } from "../../../redux/actions";

import ExerciseComponent from "./ExerciseComponent";

function Exercises(props) {
  const dispatch = useDispatch();

  // Fetch Local Exercises
  const [exercises, setExercises] = useState({});
  const globalExercises = useSelector((state) => state.exercises);
  useEffect(() => {
    setExercises(globalExercises);
  }, [globalExercises]);
  const defaultExercisesRedux = useSelector((state) => state.defaultExercises);

  // used for ExercisePicker, longpress will select the exercise(s) and highlight the selected ones and update redux with their ids
  const [selectedExercises, setSelectedExercises] = useState([]);
  const exerciseSelectable =
    props.exerciseSelectable === undefined ? false : props.exerciseSelectable;

  // state for the switch
  const [defaultExercises, setDefaultExercises] = useState(true);

  const selectExercise = (id) => {
    let updatedSelectedExerciseIds = [...selectedExercises];
    if (updatedSelectedExerciseIds.includes(id)) {
      const index = updatedSelectedExerciseIds.indexOf(id);
      updatedSelectedExerciseIds.splice(index, 1);
    } else {
      updatedSelectedExerciseIds.push(id);
    }
    setSelectedExercises(updatedSelectedExerciseIds);
  };

  const saveSelectedExercises = () => {
    dispatch(fetchSelectedExercises(selectedExercises));
    props.navigation.goBack(null);
  };

  const exerciseComponents = Object.keys(exercises).map((exerciseId) => {
    // Only list items that are not empty (=deleted)
    if (exercises[exerciseId].name) {
      const selectedPicker = selectedExercises.includes(parseInt(exerciseId));
      return (
        <ExerciseComponent
          key={exerciseId}
          id={exerciseId}
          exercise={exercises[exerciseId]}
          navigation={props.navigation}
          exerciseSelectable={exerciseSelectable}
          selectedExercises={selectedExercises}
          selectExercise={selectExercise}
          selectedPicker={selectedPicker}
        />
      );
    } else {
      return null;
    }
  });

  const defaultExerciseComponents = Object.keys(defaultExercisesRedux).map(
    (id) => {
      const selectedPicker = selectedExercises.includes(id);
      return (
        <ExerciseComponent
          key={id}
          id={id}
          exercise={defaultExercisesRedux[id]}
          navigation={props.navigation}
          exerciseSelectable={exerciseSelectable}
          selectedExercises={selectedExercises}
          selectExercise={selectExercise}
          selectedPicker={selectedPicker}
          defaultExercise={true}
        />
      );
    }
  );

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.switch}>
          <Text>Default Exercises</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={!defaultExercises ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setDefaultExercises((prevState) => !prevState)}
            value={!defaultExercises}
            style={{ marginLeft: 10, marginRight: 10 }}
          />
          <Text>Custom Exercises</Text>
        </View>
        {exerciseSelectable && (
          <Text
            style={{ textAlign: "center", fontSize: 12, fontStyle: "italic" }}
          >
            Long press on the exercises you wish to add to your workout
          </Text>
        )}
        {defaultExercises ? defaultExerciseComponents : exerciseComponents}
        {exerciseSelectable && (
          <TouchableOpacity
            style={GlobalStyles.defaultButton}
            onPress={() => saveSelectedExercises()}
          >
            <Text style={GlobalStyles.defaultButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  switch: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export default Exercises;
