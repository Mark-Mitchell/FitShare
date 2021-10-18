import React from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";

// different packages for different platforms
import ModalMobile from "react-native-modal";
import ModalWeb from "modal-react-native-web";

import PickerComponent from "./PickerComponent";
import GlobalStyles from "../../../../assets/styling/GlobalStyles";

function PickerModal(props) {
  const handleConfirm = () => {
    props.setModalVisible(false);
  };

  const content = (
    <View style={GlobalStyles.modalContent}>
      <Text style={GlobalStyles.modalTextTitle}>
        {props.isTimedExercise ? "Time Picker" : "Reps Picker"}
      </Text>
      <Text style={GlobalStyles.modalTextBody}>
        {props.isTimedExercise
          ? "Please chose your desired duration for your exercise."
          : "Please chose your desired number of repetitions for your exercise."}
      </Text>

      {props.isTimedExercise ? (
        <PickerComponent
          handleInput={props.handleInput}
          type="time"
          startTime={props.isEditing ? props.state.time : null}
        />
      ) : (
        <PickerComponent
          type="reps"
          reps={props.state.reps}
          handleInput={props.handleInput}
        />
      )}

      <TouchableOpacity
        style={[GlobalStyles.modalButton, { width: "100%" }]}
        onPress={() => {
          handleConfirm();
        }}
      >
        <Text>Okay</Text>
      </TouchableOpacity>
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

export default PickerModal;
