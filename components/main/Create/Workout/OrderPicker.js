import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

// need to use different packages for different platforms
import ModalMobile from "react-native-modal";
import ModalWeb from "modal-react-native-web";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import { TouchableOpacity } from "react-native-web";

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
    <View style={styles.content}>
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.setModalVisible(false);
          }}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
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
          style={styles.modal}
        >
          <View style={styles.webContainer}>{content}</View>
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
          style={styles.modal}
        >
          {content}
        </ModalMobile>
      )}
    </>
  );
}

const modalBackgroundColour = "rgba(0, 0, 0, 0.5)";
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: modalBackgroundColour,
    margin: 0,
  },
  webContainer: {
    flex: 1,
    backgroundColor: modalBackgroundColour,
  },
  content: {
    width: (2 / 3) * Dimensions.get("window").width,
    backgroundColor: "white",
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    height: "auto",
    margin: "auto",
    position: "relative",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ddddddad",
    padding: 10,
    width: "45%",
  },
  positionPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default OrderPicker;
