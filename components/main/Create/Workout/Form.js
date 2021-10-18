import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Input } from "react-native-magnus";

import formatTime from "../../../../assets/styling/formatTime";
import GlobalStyles from "../../../../assets/styling/GlobalStyles";
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
      <Input
        prefix={<Text>Title: </Text>}
        style={GlobalStyles.defaultInput}
        value={title}
        onChangeText={(value) => setTitle(value)}
      />
      <Input
        prefix={<Text>Description: </Text>}
        placeholder="(optional)"
        style={GlobalStyles.defaultInput}
        value={description}
        onChangeText={(value) => setDescription(value)}
        multiline={true}
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
        style={[
          GlobalStyles.optionButton,
          {
            width: "90%",
          },
        ]}
      >
        <Text style={GlobalStyles.optionButtonText}>
          Default Sets: {props.workout.generalInfo.defaultReps}
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
        style={[
          GlobalStyles.optionButton,
          {
            width: "90%",
          },
        ]}
      >
        <Text style={GlobalStyles.optionButtonText}>
          Time Between Sets: {formattedTime.timeBetweenSets}
        </Text>
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
        style={[
          GlobalStyles.optionButton,
          {
            width: "90%",
          },
        ]}
      >
        <Text style={GlobalStyles.optionButtonText}>
          Time Between Exercises: {formattedTime.timeBetweenExercises}
        </Text>
      </TouchableOpacity>
    </>
  );
}

export default Form;
