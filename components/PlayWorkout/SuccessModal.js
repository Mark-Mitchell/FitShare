import React from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";

// different packages for different platforms
import ModalMobile from "react-native-modal";
import ModalWeb from "modal-react-native-web";

import GlobalStyles from "../../assets/styling/GlobalStyles";

import { MaterialCommunityIcons } from "@expo/vector-icons";

function DeleteConformation(props) {
  const handleConfirm = () => {
    props.navigation.popToTop();
  };

  const content = (
    <View style={GlobalStyles.modalContent}>
      <Text>Congratulations, you have finished your workout!</Text>
      <MaterialCommunityIcons
        name="check-box-multiple-outline"
        color="green"
        size={50}
      />

      <TouchableOpacity
        style={GlobalStyles.modalButton}
        onPress={() => {
          handleConfirm();
        }}
      >
        <Text>Go to the start page</Text>
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

export default DeleteConformation;
