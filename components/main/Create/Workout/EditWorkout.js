import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useDispatch, useSelector } from "react-redux";
import { fetchLocalWorkouts } from "../../../../redux/actions";

import WorkoutPage from "../../Workouts/WorkoutPage";
import Form from "./Form";
import ReordableList from "./ReordableList";

import generateId from "../../../../assets/global functions/generateId";
import {
  defaultColor,
  defaultLightColor,
} from "../../../../assets/styling/GlobalColors";
import GlobalStyles from "../../../../assets/styling/GlobalStyles";

function EditWorkout(props) {
  const isEditing = props.hasOwnProperty("route");

  const exercises = useSelector((state) => state.exercises);

  const initialWorkoutState = isEditing
    ? props.route.params.workout
    : {
        generalInfo: {
          title: "",
          description: "",
          defaultTimeBetweenSets: 10,
          defaultTimeBetweenExercises: 30,
          defaultReps: 1,
        },
        exercises: {},
      };

  const initialSelectedExercises = isEditing
    ? Object.keys(props.route.params.workout.exercises).map(
        (index) => props.route.params.workout.exercises[parseInt(index)].info.id
      )
    : [];

  const [step, setStep] = useState(1);
  const [selectedExercises, setSelectedExercises] = useState(
    initialSelectedExercises
  );
  const [workout, setWorkout] = useState(initialWorkoutState);

  const [error, setError] = useState("");

  // Generate the workout in the background after every change
  useEffect(() => {
    setWorkout((prevState) => {
      let newExerciseState = {};
      for (let i = 0; i < selectedExercises.length; i++) {
        const timeBetweenExercises = prevState.exercises.hasOwnProperty(i)
          ? prevState.exercises[parseInt(i)].timeBetweenExercises
            ? prevState.exercises[parseInt(i)].timeBetweenExercises
            : null
          : null;
        const timeBetweenSets = prevState.exercises.hasOwnProperty(i)
          ? prevState.exercises[parseInt(i)].timeBetweenSets
            ? prevState.exercises[parseInt(i)].timeBetweenSets
            : null
          : null;

        const reps = prevState.exercises.hasOwnProperty(i)
          ? prevState.exercises[parseInt(i)].reps
            ? prevState.exercises[parseInt(i)].reps
            : null
          : null;

        if (
          selectedExercises[i].includes("d") ||
          exercises[selectedExercises[i]].name
        ) {
          newExerciseState = {
            ...newExerciseState,
            [i]: {
              info: {
                id: selectedExercises[i],
                // id: exercises[selectedExercises[i]].id,
              },
              position: i + 1,
              timeBetweenExercises,
              timeBetweenSets,
              reps,
            },
          };
        }
      }

      return {
        ...prevState,
        exercises: newExerciseState,
      };
    });
  }, [selectedExercises]);

  // Save the Workout
  const dispatch = useDispatch();
  const reduxWorkouts = useSelector((state) => state.workouts);

  const saveWorkout = async () => {
    if (!workout.generalInfo.title)
      return setError("Please enter a title in step 2.");
    if (Object.keys(workout.exercises).length < 1)
      return setError(
        "Please add at least one exercise to the workout in step 1."
      );

    // save to redux
    const id = isEditing
      ? props.route.params.workout.generalInfo.id
      : generateId(reduxWorkouts);

    const newState = {
      ...reduxWorkouts,
      [id]: {
        ...workout,
        generalInfo: {
          ...workout.generalInfo,
          id,
        },
      },
    };

    dispatch(fetchLocalWorkouts(newState));

    // save to LocalStorage
    try {
      await AsyncStorage.setItem("workouts", JSON.stringify(newState));
    } catch (error) {
      console.log(error);
    }

    // reset form
    setWorkout(initialWorkoutState);
    setStep(1);
    setSelectedExercises([]);

    // return to start
    isEditing
      ? props.navigation.popToTop()
      : props.navigation.navigate("Workouts");
  };

  return (
    <SafeAreaView style={{ height: "100%", paddingBottom: 75 }}>
      <ScrollView
        style={{
          height: "100%",
        }}
      >
        {!!error && <Text style={GlobalStyles.errorText}>{error}</Text>}
        <Text
          style={{ fontSize: 12, fontStyle: "italic", textAlign: "center" }}
        >
          Complete all three steps to create your workout!
        </Text>

        {/* Step Controls (always shown on the top) */}
        <View style={styles.stepControl}>
          <MaterialCommunityIcons
            name="circle"
            size={25}
            color={step === 1 ? defaultLightColor : defaultColor}
            onPress={() => setStep(1)}
            style={{ margin: 5 }}
          />
          <MaterialCommunityIcons
            name="circle"
            size={25}
            color={step === 2 ? defaultLightColor : defaultColor}
            onPress={() => setStep(2)}
            style={{ margin: 5 }}
          />
          <MaterialCommunityIcons
            name="circle"
            size={25}
            color={step === 3 ? defaultLightColor : defaultColor}
            onPress={() => setStep(3)}
            style={{ margin: 5 }}
          />
        </View>
        <View style={styles.container}>
          {/* Step One (Chosing the exercises and their order) */}
          {step === 1 && (
            <View style={{ paddingBottom: 75 }}>
              <TouchableOpacity
                style={[GlobalStyles.optionButton, { width: "90%" }]}
                onPress={() => props.navigation.navigate("ExercisePicker")}
              >
                <MaterialCommunityIcons name="plus" size={15} />
                <Text style={GlobalStyles.optionButtonText}>Exercise</Text>
              </TouchableOpacity>
              <ReordableList
                navigation={props.navigation}
                setSelectedExercises={setSelectedExercises}
                selectedExercises={selectedExercises}
              />
            </View>
          )}
          {/* Step Two (General Info & Default rest times) */}
          {step === 2 && (
            <>
              <Form setWorkout={setWorkout} workout={workout} />
            </>
          )}
          {/* Step Three (Modify default rest times and save) */}
          {step === 3 && (
            <>
              <TouchableOpacity
                style={GlobalStyles.defaultButton}
                onPress={() => saveWorkout()}
              >
                <Text style={GlobalStyles.defaultButtonText}>Save</Text>
              </TouchableOpacity>
              <WorkoutPage
                selectedExercises={selectedExercises}
                navigation={props.navigation}
                workout={workout}
                setWorkout={setWorkout}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepControl: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
  },
});

export default EditWorkout;
