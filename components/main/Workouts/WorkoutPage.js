import React, { useEffect, useState } from "react";
import { Text } from "react-native";

import { useSelector } from "react-redux";

import ExerciseComponent from "../Exercises/ExerciseComponent";
import TimeRepsPicker from "../Create/Workout/TimeRepsPicker";

function WorkoutPage(props) {
  // get workout from props or through react navigation
  const isViewOnly = !props.hasOwnProperty("workout"); // return true if the times shouldn't be changeable
  const propWorkout = isViewOnly ? props.route.params.workout : props.workout;

  const exercises = useSelector((state) => state.exercises);

  const [workout, setWorkout] = useState(propWorkout);
  const [exercisesComponent, setExercisesComponent] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [pickerInfo, setPickerInfo] = useState({
    time: null,
    index: null,
    type: undefined,
    repsPicker: false,
    editingSingleExercise: true,
  });

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
      if (exercises[propWorkout.exercises[i].info.id].hasOwnProperty("name")) {
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
          />
        );
      }
    }
    setExercisesComponent(components);
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

  return (
    <>
      <TimeRepsPicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        info={pickerInfo}
        handleTimeChange={handleTimeChange}
        handleRepsChange={handleRepsChange}
      />

      <Text>Workout Page</Text>
      <Text>{propWorkout.generalInfo.title}</Text>
      <Text>{propWorkout.generalInfo.description}</Text>

      {exercisesComponent}
    </>
  );
}

export default WorkoutPage;