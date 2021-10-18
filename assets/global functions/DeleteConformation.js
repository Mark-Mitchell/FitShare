import React from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";

// different packages for different platforms
import ModalMobile from "react-native-modal";
import ModalWeb from "modal-react-native-web";
import GlobalStyles from "../styling/GlobalStyles";

function DeleteConformation(props) {
  const handleConfirm = () => {
    props.changeOnConfirm(true);
    props.setModalVisible(false);
  };

  const content = (
    <View style={GlobalStyles.modalContent}>
      <Text style={GlobalStyles.modalTextTitle}>{props.title}</Text>
      <Text style={GlobalStyles.modalTextBody}>{props.body}</Text>

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
            handleConfirm();
          }}
        >
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
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

export default DeleteConformation;
