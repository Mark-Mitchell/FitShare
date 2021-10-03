import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// need to use different packages for different platforms
import ModalMobile from "react-native-modal";
import ModalWeb from "modal-react-native-web";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import GlobalStyles from "../../../../assets/styling/GlobalStyles";

function OrderPicker(props) {
  const [position, setPosition] = useState(props.currentPos);
  const [disabled, setDisabled] = useState({ left: false, right: false });

  // set initial position and disable buttons accordingly (if min/max num)
  useEffect(() => {
    setPosition(props.currentPos);
    if (props.currentPos === 1) {
      setDisabled({
        left: true,
        right: false,
      });
    } else if (props.currentPos === props.maxPos) {
      setDisabled({
        left: false,
        right: true,
      });
    }
  }, [props.currentPos]);

  const changePos = (num) => {
    let newPos = position + num;
    // disable button when max/min num in reached
    // "swiping" to the left
    if (num === -1) {
      if (position === props.maxPos) {
        setDisabled({
          left: false,
          right: false,
        });
        // setPosition(newPos);
      } else if (newPos <= 1) {
        setDisabled({
          left: true,
          right: false,
        });
        newPos = 1;
      }
      setPosition(newPos);

      // "swiping" to the right
    } else if (num === 1) {
      if (position === 1) {
        setDisabled({
          left: false,
          right: false,
        });
      } else if (newPos >= props.maxPos) {
        setDisabled({
          right: true,
          left: false,
        });
        newPos = props.maxPos;
      }
      setPosition(newPos);
    }
  };

  const content = (
    <View style={GlobalStyles.modalContent}>
      <Text>Move to Position</Text>

      <View style={styles.positionPicker}>
        <Pressable disabled={disabled.left} onPress={() => changePos(-1)}>
          <MaterialCommunityIcons name="arrow-left" size={30} />
        </Pressable>
        <Text>{position}</Text>
        <Pressable disabled={disabled.right} onPress={() => changePos(1)}>
          <MaterialCommunityIcons name="arrow-right" size={30} />
        </Pressable>
      </View>

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
            props.moveToNewPos(props.currentPos, position);
            props.setModalVisible(false);
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

const styles = StyleSheet.create({
  positionPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default OrderPicker;
