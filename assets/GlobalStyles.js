import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
});
