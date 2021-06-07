import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
