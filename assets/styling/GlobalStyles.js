import { StyleSheet, Platform, Dimensions } from "react-native";
import { grayButtonColor, modalBackgroundColor } from "./GlobalColors";

export default StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  modal: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: modalBackgroundColor,
    margin: 0,
  },
  modalWebContainer: {
    flex: 1,
    backgroundColor: modalBackgroundColor,
  },
  modalContent: {
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
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    alignItems: "center",
    backgroundColor: grayButtonColor,
    padding: 10,
    width: "45%",
  },
});
