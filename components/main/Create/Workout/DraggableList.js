import React, { useState, useEffect } from "react";
// PanResponder is responsible for the dragging
// Animated => React Native Animations
// Dimensions used for the device's size, then calculate the center of the screen for the circle
import {
  StyleSheet,
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions,
  Button,
  Easing,
  SafeAreaView,
} from "react-native";

import { DraggableItem, ITEM_HEIGHT } from "./DraggableItem";
import GlobalStyles from "../../../../assets/GlobalStyles";

function DraggableList(props) {
  const [dropZoneValues, setDropZoneValues] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [itemPositions, setItemPositions] = useState({ test: { y: 100 } });

  // const [test, setTest] = useState([]);

  const calculateDropZoneValues = (event) => {
    setDropZoneValues(event.nativeEvent.layout);
  };

  // useEffect(() => {
  //   console.log("ItemPosition state changed");
  //   console.log(itemPositions);
  // }, [itemPositions]);

  // calculate pos for each item in array
  const calculatePositions = (items) => {
    const startingPos = 200;
    let positions = {};
    for (let i = 0; i < items.length; i++) {
      // const posY = startingPos + (ITEM_HEIGHT * i - ITEM_HEIGHT / 2)
      const posY = startingPos + ITEM_HEIGHT * (i - 0.5);

      positions = {
        ...positions,
        [items[i]]: {
          order: i,
          y: posY,
          animating: false,
        },
      };
    }
    setItemPositions(positions);
    // return positions;
  };

  // recalculate positions after every order change
  useEffect(() => {
    setSelectedExercises(props.selectedExercises);
    calculatePositions(props.selectedExercises);
  }, [props.selectedExercises]);

  // moved is either up or down
  const reorder = (itemOrder, moved) => {
    // don't reorder anything if it's the first or last item
    if (
      (itemOrder === 0 && moved === "ITEM_MOVED_UP") ||
      (itemOrder === selectedExercises.length - 1 &&
        moved === "ITEM_MOVED_DOWN")
    )
      return;

    const item = selectedExercises[itemOrder];
    const itemIndexToBeMoved =
      moved === "ITEM_MOVED_UP" ? itemOrder - 1 : itemOrder + 1;
    const itemToBeMoved = selectedExercises[itemIndexToBeMoved];

    const offset = moved === "ITEM_MOVED_UP" ? ITEM_HEIGHT : ITEM_HEIGHT * -1;
    // console.log(offset);
    const defaultPosOfItemToBeMoved = itemPositions[itemToBeMoved].y + offset;

    // set new default pos and set animating to true (doesn't update the position in the child component)
    setItemPositions((prevState) => ({
      ...prevState,
      [itemToBeMoved]: {
        order: itemOrder,
        y: prevState[item].y,
        animating: true,
      },
      [item]: {
        order: itemIndexToBeMoved,
        y: prevState[itemToBeMoved].y,
        animating: false,
      },
    }));

    // Animate the swapping
    Animated.timing(itemPositions[itemToBeMoved].pan, {
      toValue: itemPositions[itemToBeMoved],
      // easing: Easing.back(),
      duration: 1000,
    }).start(() =>
      // Reset the offset from spring using Animated.timing()
      Animated.timing(itemPositions[itemToBeMoved].pan, {
        toValue: itemPositions[itemToBeMoved],
        // easing: Easing.linear,
        duration: 0.0001,
        useNativeDriver: true,
      }).start(() => {
        // set animating to false to update the correct position
        setItemPositions((prevState) => ({
          ...prevState,
          [itemToBeMoved]: {
            ...prevState[itemToBeMoved],
            animating: false,
          },
        }));

        // reorder the array
        let newOrder = selectedExercises;
        // newOrder.splice(itemOrder, 1);
        // newOrder.splice(itemIndexToBeMoved, 0, item);
        [newOrder[itemOrder], newOrder[itemIndexToBeMoved]] = [
          newOrder[itemIndexToBeMoved],
          newOrder[itemOrder],
        ];
        console.log(newOrder);
        setSelectedExercises(newOrder);
      })
    );

    // Animated.spring(itemPositions[itemToBeMoved].pan, {
    //   toValue: { x: 0, y: offset },
    //   // this line is needed, only works on false for some reason
    //   useNativeDriver: false,
    // }).start(() => {
    //   setItemPositions((prevState) => ({
    //     ...prevState,
    //     [itemToBeMoved]: {
    //       ...prevState[itemToBeMoved],
    //       order: itemOrder,
    //       y: prevState[item].y,
    //     },
    //     [item]: {
    //       ...prevState[item],
    //       order: itemIndexToBeMoved,
    //       y: prevState[itemToBeMoved].y,
    //     },
    //   }));
    // });

    // set new default pos for neighbour item
    // setItemPositions((prevState) => ({
    //   ...prevState,
    //   [itemToBeMoved]: {
    //     ...prevState[itemToBeMoved],
    //     order: itemOrder,
    //     y: defaultPosOfItemToBeMoved,
    //   },
    //   [item]: {
    //     ...prevState[item],
    //     order: itemIndexToBeMoved,
    //     y: prevState[itemToBeMoved].y,
    //   },
    // }));
    // set new default pos for moving item
  };

  const testFunctionSetPan = (item, pan) => {
    // const object = {
    //   ...itemPositions,
    //   [item]: {
    //     ...itemPositions[item],
    //     pan,
    //   },
    // };
    setItemPositions((oldState) => ({
      ...oldState,
      [item]: {
        ...oldState[item],
        pan,
      },
    }));
    // const testObject = {
    //   ...itemPositions[item],
    //   pan,
    // };
    // console.log(testObject);
    // console.log(object);
  };

  const [transformTest, setTransformTest] = useState(0);
  const DraggableItems = () => {
    // const itemPositions = calculatePositions(props.selectedExercises);

    return selectedExercises.map((item) => {
      const posY = itemPositions[item].y;
      return (
        <DraggableItem
          key={item}
          dropZoneValues={dropZoneValues}
          orderPositionY={itemPositions[item].y}
          itemInfo={item}
          reorder={reorder}
          animateToNewPositionY={itemPositions[item].y}
          animateToNewPositionY={itemPositions}
          testFunctionSetPan={testFunctionSetPan}
          setItemPositions={setItemPositions}
          itemPositions={itemPositions}
          order={itemPositions[item].order}
          transformTest={transformTest}
          animating={itemPositions[item].animating}
        />
      );
    });
  };

  return (
    <SafeAreaView style={GlobalStyles.screenContainer}>
      <View style={styles.mainContainer}>
        {/* <View style={styles.dropZone} onLayout={calculateDropZoneValues}>
          <Text style={styles.text}>Drop me here!</Text>
        </View> */}

        {DraggableItems()}
      </View>
      {/* <Text>Edit Workout</Text>
      <Button
        title="Add Exercise"
        onPress={() => props.navigation.navigate("ExercisePicker")}
      /> */}

      {/* <Button
        title="Change first item Pos"
        onPress={() => {
          console.log("Clicked");
          // setItemPositions({
          //   ...itemPositions,
          //   "Ex 1": {
          //     ...itemPositions["Ex 1"],
          //     y: 600,
          //   },
          // });
          setItemPositions("Hello");
        }}
      onPress={() => console.log("click")}
      /> */}

      {/* <Button
        title="Show itemPositions"
        onPress={() => console.log(itemPositions)}
      />
      <Button
        title="Animate Ex 1"
        onPress={() => {
          Animated.spring(itemPositions["Ex 1"].pan, {
            toValue: { x: 0, y: 300 },
            // this line is needed, only works on false for some reason
            useNativeDriver: false,
          }).start();
        }}
      />
      <Button
        title="Animate Ex 2"
        onPress={() => {
          Animated.spring(itemPositions["Ex 2"].pan, {
            toValue: { x: 0, y: 400 },
            // this line is needed, only works on false for some reason
            useNativeDriver: false,
          }).start();
        }}
      />
      <Button
        title="Animate Ex 3"
        onPress={() => {
          Animated.spring(itemPositions["Ex 3"].pan, {
            toValue: { x: 0, y: 200 },
            // this line is needed, only works on false for some reason
            useNativeDriver: false,
          }).start();
          setItemPositions((oldState) => ({
            ...oldState,
            ["Ex 3"]: {
              ...oldState["Ex 3"],
              y: 500,
            },
          }));
        }}
      /> */}
      <Button
        title="Animate a box down and change its default pos"
        onPress={() => {
          // first spring down
          Animated.spring(itemPositions["Ex 3"].pan, {
            toValue: { x: 0, y: 100 },
            // this line is needed, only works on false for some reason
            useNativeDriver: true,
          }).start(
            () => itemPositions["Ex 3"].pan.flattenOffset()
            // null
          );

          // Animated.timing(itemPositions["Ex 3"].pan, {
          //   toValue: itemPositions["Ex 3"] + 100,
          //   easing: Easing.linear,
          //   duration: 100,
          //   useNativeDriver: true,
          // }).start(() =>
          //   setItemPositions((prevState) => ({
          //     ...prevState,
          //     ["Ex 3"]: {
          //       ...prevState["Ex 3"],
          //       y: prevState["Ex 3"].y + 100,
          //     },
          //   }))
          // );
        }}
      />

      <Button
        title="changeTranslateState"
        onPress={() => {
          setTransformTest(100);
        }}
      />
    </SafeAreaView>
  );
}

let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  dropZone: {
    height: 100,
    backgroundColor: "blue",
  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
    color: "#fff",
  },
});

export default DraggableList;
