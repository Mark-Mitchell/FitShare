import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  StyleSheet,
} from "react-native";

import GlobalStyles from "../../../assets/styling/GlobalStyles";

function AppInfo(props) {
  return (
    <>
      <ScrollView>
        <View style={{ height: Dimensions.get("window").height, padding: 30 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            AirWorkout
          </Text>
          <Text style={styles.text}>
            Hello there! 👋 Thank you for checking out my app! This app was
            created as my matriculation project. Feedback is kindly apreciated!
            ❤️
          </Text>
          <Text>{"\n"}</Text>
          <Text>{"\n"}</Text>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            For Feedback and Support {"\n"}(including account relating
            questions):
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons name="email" size={14} />
            <Text style={styles.text}> mark.airworkout@gmail.com</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons name="instagram" size={14} />
            <Text style={styles.text}> @mark_mitchell6</Text>
          </View>

          <Text>{"\n"}</Text>
          <Text style={styles.text}>
            The app's privacy policy can be found here:
          </Text>
          <Text
            style={[GlobalStyles.link, styles.text]}
            onPress={() =>
              Linking.openURL("https://airworkout.vercel.app/privacypolicy")
            }
          >
            https://airworkout.vercel.app/privacypolicy
          </Text>
          <Text>{"\n"}</Text>
          <Text>{"\n"}</Text>
          <Text style={styles.text}>
            The "air" in the app's AirWorkout stands for the verb to air, which
            means to express something publically (this app can share workouts
            with your friends).{" "}
          </Text>
          <Text>{"\n"}</Text>
          <Text>{"\n"}</Text>
          <Text style={styles.text}>© 2021 Mark Mitchell</Text>
        </View>

        <Text style={{ margin: 10, textAlign: "center", fontWeight: "bold" }}>
          Here are some button to only click if you are sure what you are doing.
          NO CONFIRMATION IS ASKED!
        </Text>
        <View style={GlobalStyles.optionButtonContainer}>
          <TouchableOpacity
            onPress={() => props.route.params.deleteAll("exercises")}
            style={[GlobalStyles.optionButton, { backgroundColor: "red" }]}
          >
            <Text style={{ fontWeight: "bold" }}>Delete all Exercises</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.route.params.deleteAll("workouts")}
            style={[GlobalStyles.optionButton, { backgroundColor: "red" }]}
          >
            <Text style={{ fontWeight: "bold" }}>Delete all Workouts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default AppInfo;
