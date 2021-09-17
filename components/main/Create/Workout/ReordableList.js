import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";

import { useSelector, useDispatch } from "react-redux";

import { fetchSelectedExercises } from "../../../../redux/actions";
import ExerciseComponent from "../../Exercises/ExerciseComponent";
import OrderPicker from "./OrderPicker";

function ReordableList(props) {
  const exercises = useSelector((state) => state.exercises);
  const selectedReduxExercises = useSelector(
    (state) => state.selectedExercises
  );

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedExercises, setSelectedExercises] = useState([]);
  const [renderedItems, setRenderedItems] = useState(null);

  const [currentPosItemToChange, setCurrentPosItemToChange] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    // prevent an endless loop from dispatch()
    if (selectedReduxExercises.length === 0) return;

    // set the selected exercises from redux and then reset the redux state
    setSelectedExercises((prevState) => {
      const updatedSelectedExercises = [...prevState];
      updatedSelectedExercises.push(...selectedReduxExercises);
      return updatedSelectedExercises;
    });
    dispatch(fetchSelectedExercises([]));
  }, [selectedReduxExercises]);

  const moveToNewPos = (currentPos, newPos) => {
    // reorder the array
    let newOrder = [...selectedExercises];
    const itemId = selectedExercises[currentPos - 1];
    newOrder.splice(currentPos - 1, 1);
    newOrder.splice(newPos - 1, 0, itemId);
    setCurrentPosItemToChange(0);
    setSelectedExercises(newOrder);
  };

  const openModal = (currentPos) => {
    setCurrentPosItemToChange(currentPos);
    setModalVisible(true);
  };

  const removeItemFromList = (index) => {
    setSelectedExercises((prevState) => {
      const updatedState = [...prevState];
      updatedState.splice(index - 1, 1);
      return updatedState;
    });
  };

  const setItems = () => {
    let selectedExercisesComponents = [];
    let currentIndex = 1;
    for (let i = 0; i < selectedExercises.length; i++) {
      // Only list items that are not empty (=deleted)
      const id = selectedExercises[i];
      if (exercises[id].name) {
        selectedExercisesComponents.push(
          <ExerciseComponent
            key={currentIndex}
            id={selectedExercises[i]}
            exercise={exercises[selectedExercises[i]]}
            navigation={props.navigation}
            workout={true}
            openModal={openModal}
            removeItemFromList={removeItemFromList}
            currentIndex={currentIndex}
          />
        );
        currentIndex += 1;
      } else {
      }
    }
    setRenderedItems(selectedExercisesComponents);
  };

  useEffect(() => {
    // after the component finishes loading set the Items
    if (loading === false) {
      setItems();
    }
  }, [loading]);

  useEffect(() => {
    // set the items (again) after selectedExercises update
    if (loading === false) {
      setItems();
    }
  }, [selectedExercises]);

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>{renderedItems}</View>

      <OrderPicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        currentPos={currentPosItemToChange}
        maxPos={selectedExercises.length}
        moveToNewPos={moveToNewPos}
      />
    </SafeAreaView>
  );
}

let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

export default ReordableList;
