import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GlobalStyles from "../assets/styling/GlobalStyles";

function WelcomePage(props) {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 25 }}>
          <Text style={styles.title}>👋 Welcome to AirWorkout! 👋</Text>
          <Text>{"\n"}</Text>
          <Text style={styles.text}>
            With this app you can create custom exercises and workouts! You can
            also create workouts using predefined exercises, so called default
            exercises, to create workouts that you can share with your friends
            by sharing its ID.{" "}
          </Text>
          <Text>{"\n"}</Text>
          <Text style={styles.text}>
            Tell your friends about this app and do some fun workouts together!
          </Text>
          <Text>{"\n"}</Text>
          <Text>{"\n"}</Text>
          <Text style={styles.text}>
            For more information on the app head over to the profile page of the
            app (the button on the right on the menu).
          </Text>
          <Text>{"\n"}</Text>
          <Text>{"\n"}</Text>
          <Text style={styles.text}>
            Please enjoy your stay and have fun training! 💪
          </Text>
          <TouchableOpacity
            style={GlobalStyles.defaultButton}
            onPress={() => props.getStarted()}
          >
            <Text style={GlobalStyles.defaultButtonText}>Get started!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default WelcomePage;
