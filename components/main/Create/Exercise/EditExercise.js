// Warning on Web, broken with new version of react native web, but works
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchEquipmentPicker,
  fetchLocalData,
} from "../../../../redux/actions";

import ImagePicker from "./ImagePicker";
import * as FileSystem from "expo-file-system";

import { defaultEquipment } from "../../../../assets/exercise data/equipment";
import generateId from "../../../../assets/global functions/generateId";
import GlobalStyles from "../../../../assets/styling/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Input } from "react-native-magnus";
import PickerModal from "./PickerModal";
import formatTime from "../../../../assets/styling/formatTime";
import { StorageAccessFramework } from "expo-file-system";

function EditExercise(props) {
  const localExercises = useSelector((state) => state.exercises);

  const isEditing = props.hasOwnProperty("route");

  const initialState = isEditing
    ? localExercises[props.route.params.id]
    : {
        id: 0,
        name: "",
        description: "",
        equipment: {},
        time: -1,
        reps: 1,
        image: "",
        moreInfo: "",
        image: "",
        dropSets: false,
        dropSetInfo: {},
      };
  const [state, setState] = useState(initialState);
  const [modalVisible, setModalVisible] = useState(false);

  const [error, setError] = useState("");

  // Timed exercise or Reps based
  const [isTimedExercise, setIsTimeExercise] = useState(
    isEditing ? state.time !== -1 : false
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading === true) return setLoading(false);
    setState((prevState) => {
      return {
        ...prevState,
        time: isTimedExercise ? 0 : -1,
        reps: isTimedExercise ? -1 : 1,
      };
    });
  }, [isTimedExercise]);

  const handleInput = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  // update state when equipment is updated from the EquipmentPicker using redux
  const equipment = useSelector((state) => state.equipmentPicker);
  useEffect(() => {
    setState({
      ...state,
      equipment,
    });
  }, [equipment]);

  // Handle Submit
  const dispatch = useDispatch();

  const submitForm = async () => {
    if (!state.name) return setError("Please set a title for your exercise.");

    try {
      const id = isEditing ? state.id : generateId(localExercises);
      let image = "";
      // Save Image locally
      if (Platform.OS !== "web" && state.image) {
        try {
          const initialInfo = await FileSystem.getInfoAsync(state.image);
          // console.log(initialInfo.uri);
          await FileSystem.copyAsync({
            from: state.image,
            to: FileSystem.documentDirectory + "exercise-" + id + ".png",
          });
          const getInfo = await FileSystem.getInfoAsync(
            FileSystem.documentDirectory + "exercise-" + id + ".png"
          );
          image = getInfo ? getInfo.uri : "";
        } catch (error) {
          console.log(error);
        }
      }
      // Add to Local Storage
      const newExercise = {
        [id]: {
          ...state,
          id,
          image: image,
        },
      };

      const exercises = {
        ...localExercises,
        ...newExercise,
      };

      await AsyncStorage.setItem("exercises", JSON.stringify(exercises));

      // Reset Form
      setState(initialState);
      // Update global state
      dispatch(fetchLocalData(exercises));
      isEditing
        ? props.navigation.goBack()
        : props.navigation.navigate("Exercises");
      // reset equipmentPicker in redux
      dispatch(fetchEquipmentPicker(defaultEquipment));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <View>
        {!!error && <Text style={GlobalStyles.errorText}>{error}</Text>}
        <View style={styles.container}>
          <Input
            prefix={<Text>Title: </Text>}
            style={GlobalStyles.defaultInput}
            onChangeText={(value) => handleInput("name", value)}
            value={state.name}
          />
          <Input
            prefix={<Text>Description: </Text>}
            placeholder="(optional)"
            style={GlobalStyles.defaultInput}
            onChangeText={(value) => handleInput("description", value)}
            value={state.description}
            multiline={true}
          />

          <View style={styles.isTimedExerciseContainer}>
            <Text>Repetitions </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isTimedExercise ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setIsTimeExercise((prevState) => !prevState)}
              value={isTimedExercise}
            />
            <Text> Duration</Text>
          </View>

          {/* Modal for Time / Reps Picker */}
          <PickerModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            isTimedExercise={state.time !== -1}
            handleInput={handleInput}
            isEditing={isEditing}
            state={state}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={GlobalStyles.optionButton}
          >
            <Text>
              {state.time !== -1
                ? "Duration: " + formatTime(state.time)
                : "Repetitions: " + state.reps}
            </Text>
          </TouchableOpacity>

          <Input
            prefix={<Text>More info: </Text>}
            placeholder="(optional)"
            style={GlobalStyles.defaultInput}
            onChangeText={(value) => handleInput("moreInfo", value)}
            value={state.moreInfo}
            multiline={true}
          />
        </View>

        {/* Option Buttons */}
        <View style={GlobalStyles.optionButtonContainer}>
          <ImagePicker
            setImage={(val) => handleInput("image", val)}
            imgURI={state.image}
          />

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("EquipmentPicker", { state })
            }
            style={GlobalStyles.optionButton}
          >
            <MaterialCommunityIcons name="dumbbell" size={15} />
            <Text style={GlobalStyles.optionButtonText}>Equipment</Text>
          </TouchableOpacity>
        </View>

        {/* 
        <Button
          style={styles.halfButton}
          onPress={() => handleInput("dropSets", !state.dropSets)}
          title="Drop Sets"
        />
        <DropSets
          state={state}
          setState={setState}
          generateId={generateId}
          styles={styles}
        /> */}

        <TouchableOpacity
          style={GlobalStyles.defaultButton}
          onPress={() => submitForm()}
        >
          <Text style={GlobalStyles.defaultButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },

  input: {
    height: 40,
    marginTop: 5,
  },

  error: {
    borderColor: "red",
    borderWidth: 1,
  },

  buttonContainer: {
    marginTop: 5,
  },

  halfButton: {
    flex: 0.5,
  },

  isTimedExerciseContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export default EditExercise;
