import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import formatTime from "../../../../assets/styling/formatTime";
import TimeRepsPicker from "./TimeRepsPicker";

function Form(props) {
  const [modalVisible, setModalVisible] = useState(false);

  const [title, setTitle] = useState(props.workout.generalInfo.title);
  const [description, setDescription] = useState(
    props.workout.generalInfo.description
  );

  const [currentTimeType, setCurrentTimeType] = useState(undefined);
  const [time, setTime] = useState({
    timeBetweenSets: props.workout.generalInfo.defaultTimeBetweenSets,
    timeBetweenExercises: props.workout.generalInfo.defaultTimeBetweenExercises,
  });
  // const [reps, setReps] = useState(0);
  const [pickerInfo, setPickerInfo] = useState({
    index: null,
    repsPicker: false,
    editingSingleExercise: false,
  });

  const [formattedTime, setFormattedTime] = useState({
    timeBetweenSets: null,
    timeBetweenExercises: null,
  });

  // when time is changed set the state in the parent component and format it for the UI
  useEffect(() => {
    setFormattedTime({
      timeBetweenSets: formatTime(time.timeBetweenSets),
      timeBetweenExercises: formatTime(time.timeBetweenExercises),
    });

    props.setWorkout((prevState) => {
      return {
        ...prevState,
        generalInfo: {
          ...prevState.generalInfo,
          defaultTimeBetweenExercises: time.timeBetweenExercises,
          defaultTimeBetweenSets: time.timeBetweenSets,
        },
      };
    });
  }, [time]);

  // update parent state when title / description is changed
  useEffect(() => {
    props.setWorkout((prevState) => {
      return {
        ...prevState,
        generalInfo: {
          ...prevState.generalInfo,
          title,
          description,
        },
      };
    });
  }, [title, description]);

  const handleTimeChange = (type, time) => {
    setTime((prevState) => {
      return {
        ...prevState,
        [type]: time,
      };
    });
  };

  const handleRepsChange = (type, reps) => {
    props.setWorkout((prevState) => {
      return {
        ...prevState,
        generalInfo: {
          ...prevState.generalInfo,
          defaultReps: reps,
        },
      };
    });
  };

  return (
    <>
      <TimeRepsPicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        time={time}
        type={currentTimeType}
        info={pickerInfo}
        handleTimeChange={handleTimeChange}
        handleRepsChange={handleRepsChange}
      />

      <Text>General Workout Settings</Text>
      <TextInput
        placeholder="Workout Title"
        value={title}
        onChangeText={(value) => setTitle(value)}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={(value) => setDescription(value)}
      />

      <TouchableOpacity
        onPress={() => {
          setPickerInfo((prevState) => {
            return {
              ...prevState,
              repsPicker: true,
            };
          });
          setModalVisible(true);
        }}
      >
        <Text>
          Default Repetitions: {props.workout.generalInfo.defaultReps}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setCurrentTimeType("timeBetweenSets");
          setPickerInfo((prevState) => {
            return {
              ...prevState,
              repsPicker: false,
            };
          });
          setModalVisible(true);
        }}
      >
        <Text>Time Between Sets: {formattedTime.timeBetweenSets}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setCurrentTimeType("timeBetweenExercises");
          setPickerInfo((prevState) => {
            return {
              ...prevState,
              repsPicker: false,
            };
          });
          setModalVisible(true);
        }}
      >
        <Text>
          Time Between Exercises: {formattedTime.timeBetweenExercises}
        </Text>
      </TouchableOpacity>
    </>
  );
}

export default Form;
