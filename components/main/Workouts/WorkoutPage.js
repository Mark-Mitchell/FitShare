import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { fetchLocalWorkouts } from "../../../redux/actions";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import ExerciseComponent from "../Exercises/ExerciseComponent";
import TimeRepsPicker from "../Create/Workout/TimeRepsPicker";
import DeleteConformation from "../../../assets/global functions/DeleteConformation";
import GlobalStyles from "../../../assets/styling/GlobalStyles";
import { defaultLightColor } from "../../../assets/styling/GlobalColors";

function WorkoutPage(props) {
  // get workout from props or through react navigation
  const isViewOnly = !props.hasOwnProperty("workout"); // return true if the times shouldn't be changeable
  const propWorkout = isViewOnly ? props.route.params.workout : props.workout;

  const exercises = useSelector((state) => state.exercises);
  const workouts = useSelector((state) => state.workouts);

  const [workout, setWorkout] = useState(propWorkout);
  const [exercisesComponent, setExercisesComponent] = useState(null);

  const [consistsOfDefaultExercises, setConsistsOfDefaultExercises] =
    useState(true);

  // Modal for TimeRepsPicker
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerInfo, setPickerInfo] = useState({
    time: null,
    index: null,
    type: undefined,
    repsPicker: false,
    editingSingleExercise: true,
  });
  // Modal for Delete Conformation
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(false);

  const dispatch = useDispatch();

  const handleTimePress = (type, index, time) => {
    if (isViewOnly) return;
    setPickerInfo((prevState) => {
      return {
        ...prevState,
        time,
        index,
        type,
        repsPicker: false,
      };
    });
    setModalVisible(true);
  };

  const handleRepsPress = (index, reps) => {
    if (isViewOnly) return;
    setPickerInfo((prevState) => {
      return {
        ...prevState,
        index,
        repsPicker: true,
      };
    });
    setModalVisible(true);
  };

  const handleTimeChange = (type, index, newTime) => {
    props.setWorkout((prevState) => {
      return {
        ...prevState,
        exercises: {
          ...prevState.exercises,
          [index]: {
            ...prevState.exercises[index],
            timeBetweenSets:
              type === "between_sets"
                ? newTime
                : prevState.exercises[index].timeBetweenSets,
            timeBetweenExercises:
              type === "after_exercise"
                ? newTime
                : prevState.exercises[index].timeBetweenExercises,
          },
        },
      };
    });
  };

  const handleRepsChange = (index, newReps) => {
    props.setWorkout((prevState) => {
      return {
        ...prevState,
        exercises: {
          ...prevState.exercises,
          [index]: {
            ...prevState.exercises[index],
            reps: newReps,
          },
        },
      };
    });
  };

  const setExercises = () => {
    let components = [];
    for (let i = 0; i < Object.keys(propWorkout.exercises).length; i++) {
      if (
        JSON.stringify(propWorkout.exercises[i].info.id).includes("d") ||
        exercises[propWorkout.exercises[i].info.id].hasOwnProperty("name")
      ) {
        if (!JSON.stringify(propWorkout.exercises[i].info.id).includes("d"))
          setConsistsOfDefaultExercises(false);
        const {
          defaultTimeBetweenExercises,
          defaultTimeBetweenSets,
          defaultReps,
        } = workout.generalInfo;

        const timeBetweenSets = workout.exercises.hasOwnProperty(i)
          ? workout.exercises[i].timeBetweenSets ||
            workout.exercises[i].timeBetweenSets === 0
            ? workout.exercises[i].timeBetweenSets
            : defaultTimeBetweenSets
          : defaultTimeBetweenSets;
        const timeBetweenExercises = workout.exercises.hasOwnProperty(i)
          ? workout.exercises[i].timeBetweenExercises ||
            workout.exercises[i].timeBetweenExercises === 0
            ? workout.exercises[i].timeBetweenExercises
            : defaultTimeBetweenExercises
          : defaultTimeBetweenExercises;

        const reps = workout.exercises.hasOwnProperty(i)
          ? workout.exercises[i].reps || workout.exercises[i].reps === 0
            ? workout.exercises[i].reps
            : defaultReps
          : defaultReps;

        components.push(
          <ExerciseComponent
            key={i}
            index={i}
            id={propWorkout.exercises[i].info.id}
            exercise={exercises[propWorkout.exercises[i].info.id]}
            navigation={props.navigation}
            workout={true}
            timeBetweenSets={timeBetweenSets}
            timeAfterExercise={timeBetweenExercises}
            reps={reps}
            handleTimePress={handleTimePress}
            handleRepsPress={handleRepsPress}
            defaultExercise={true}
          />
        );
      }
    }
    setExercisesComponent(components);
  };

  const deleteExercise = async () => {
    const newState = {
      ...workouts,
      [propWorkout.generalInfo.id]: {},
    };

    // Remove from Redux
    dispatch(fetchLocalWorkouts(newState));

    // Remove from Local Storage
    try {
      await AsyncStorage.setItem("workouts", JSON.stringify(newState));
    } catch (error) {
      console.log(error);
    }

    props.navigation.popToTop();
  };

  useEffect(() => {
    setExercises();
  }, []);

  useEffect(() => {
    setWorkout(props.workout);
  }, [props.workout]);

  useEffect(() => {
    !isViewOnly && setExercises();
  }, [workout]);

  useEffect(() => {
    toBeDeleted && deleteExercise();
  }, [toBeDeleted]);

  return (
    <ScrollView>
      <TimeRepsPicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        info={pickerInfo}
        handleTimeChange={handleTimeChange}
        handleRepsChange={handleRepsChange}
      />

      <DeleteConformation
        modalVisible={deleteModalVisible}
        setModalVisible={setDeleteModalVisible}
        changeOnConfirm={setToBeDeleted}
        title="Delete Workout?"
        body="Do you really want to delete this Workout?"
      />

      {isViewOnly && (
        <View
          style={{
            flexDirection: "row",
            alignContent: "space-between",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={[GlobalStyles.optionButton, { width: "20%" }]}
            onPress={() =>
              props.navigation.navigate("PlayWorkout", {
                workout: propWorkout,
              })
            }
          >
            <MaterialCommunityIcons name="play" size={14} />
            <Text style={{ fontSize: 14, marginLeft: 5 }}>Train</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              GlobalStyles.optionButton,
              {
                width: "20%",
                backgroundColor: consistsOfDefaultExercises
                  ? defaultLightColor
                  : "gray",
              },
            ]}
            onPress={() => {
              consistsOfDefaultExercises
                ? props.navigation.navigate("ShareWorkout", {
                    workout: propWorkout,
                  })
                : null;
            }}
            // style={{backgroundColor: consistsOfDefaultExercises ? "black" : "gray"}}
          >
            <MaterialCommunityIcons name="share" size={14} />
            <Text style={{ fontSize: 14, marginLeft: 5 }}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("EditWorkout", { workout: propWorkout })
            }
            style={[GlobalStyles.optionButton, { width: "20%" }]}
          >
            <MaterialCommunityIcons name="pencil" size={14} />
            <Text style={{ fontSize: 14, marginLeft: 5 }}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDeleteModalVisible(true)}
            style={[GlobalStyles.optionButton, { width: "20%" }]}
          >
            <MaterialCommunityIcons name="close" size={14} />
            <Text style={{ fontSize: 14, marginLeft: 5 }}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ margin: 20 }}>
        {!consistsOfDefaultExercises && (
          <Text style={{ fontStyle: "italic", fontSize: 12 }}>
            Workouts can only be shared if all of the exercises in it are
            default exercises provided by the app. If you have created a custom
            exercise that you have added to this workout you currently cannot
            share it.
          </Text>
        )}
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.title}>Title: </Text>
          <Text>{propWorkout.generalInfo.title}</Text>
        </View>

        {!!propWorkout.generalInfo.description && (
          <>
            <Text style={styles.title}>Description:</Text>
            <Text>{propWorkout.generalInfo.description}</Text>
          </>
        )}
      </View>
      {exercisesComponent}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
  },
});

export default WorkoutPage;
