import React, { useState } from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";

// need to use different packages for different platforms
import ModalMobile from "react-native-modal";
import ModalWeb from "modal-react-native-web";

import GlobalStyles from "../../../../assets/styling/GlobalStyles";
import PickerComponent from "../Exercise/PickerComponent";

function TimeRepsPicker(props) {
  const [time, setTime] = useState(0);
  const [reps, setReps] = useState(0);

  const handleTimeInput = (type, time) => setTime(time);
  const handleRepsInput = (type, reps) => setReps(parseInt(reps));

  const timePickerJSX = (
    <>
      <Text>Pick Time</Text>

      <PickerComponent handleInput={handleTimeInput} reps={reps} type="time" />

      <View style={GlobalStyles.modalButtonContainer}>
        <TouchableOpacity
          style={GlobalStyles.modalButton}
          onPress={() => {
            props.setModalVisible(false);
          }}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={GlobalStyles.modalButton}
          onPress={() => {
            if (props.info.editingSingleExercise) {
              props.handleTimeChange(props.info.type, props.info.index, time);
            } else {
              props.handleTimeChange(props.type, time);
            }
            props.setModalVisible(false);
          }}
        >
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const repsPickerJSX = (
    <>
      <Text>Pick Reps</Text>

      <PickerComponent handleInput={handleRepsInput} reps={reps} type="reps" />

      <View style={GlobalStyles.modalButtonContainer}>
        <TouchableOpacity
          style={GlobalStyles.modalButton}
          onPress={() => {
            props.setModalVisible(false);
          }}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={GlobalStyles.modalButton}
          onPress={() => {
            props.handleRepsChange(props.info.index, reps);
            props.setModalVisible(false);
          }}
        >
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const content = (
    <View style={GlobalStyles.modalContent}>
      {props.hasOwnProperty("info") && props.info.repsPicker
        ? repsPickerJSX
        : timePickerJSX}
    </View>
  );

  return (
    <>
      {Platform.OS === "web" ? (
        <ModalWeb
          animationType="slide"
          transparent={true}
          ariaHideApp={false}
          visible={props.modalVisible}
          onRequestClose={() => {
            props.setModalVisible(false);
          }}
          style={GlobalStyles.modal}
        >
          <View style={GlobalStyles.modalWebContainer}>{content}</View>
        </ModalWeb>
      ) : (
        <ModalMobile
          animationType="slide"
          transparent={true}
          ariaHideApp={false}
          visible={props.modalVisible}
          onRequestClose={() => {
            props.setModalVisible(false);
          }}
          style={GlobalStyles.modal}
        >
          {content}
        </ModalMobile>
      )}
    </>
  );
}

export default TimeRepsPicker;
