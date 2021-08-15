import React, { useState, useEffect } from "react";
import {
  View,
  Animated,
  Dimensions,
  Text,
  StyleSheet,
  PanResponder,
} from "react-native";

export const ITEM_HEIGHT = 100;
let Window = Dimensions.get("window");

export function DraggableItem(props) {
  const [pan, setPan] = useState(new Animated.ValueXY());
  const [showDraggable, setShowDraggable] = useState(true);
  const [defaultPositionY, setDefaultPositionY] = useState(null);
  const [draggingItem, setDraggingItem] = useState(false);

  useEffect(() => {
    // console.log(props.itemInfo)
    // props.setItemPositions({
    //   ...props.itemPositions,
    //   [props.itemInfo]: {
    //     ...props.itemPositions[props.itemInfo],
    //     pan,
    //   },
    // });
    setDefaultPositionY(props.orderPositionY);
    props.testFunctionSetPan(props.itemInfo, pan);
    // console.log(props.itemInfo);
  }, []);

  useEffect(() => {
    // only change default pos when not dragging
    if (!draggingItem || !props.animating) {
      setDefaultPositionY(props.orderPositionY);
      console.log("set def pos");
    }
  }, [props.orderPositionY, props.animating]);

  const movedOutsideOfOrderPosition = (gesture) => {
    const gestureY = gesture.moveY;
    const orderY = props.orderPositionY;
    const offset = ITEM_HEIGHT / 2;
    if (!(gestureY < orderY - offset || gestureY > orderY + offset)) {
      return false;
    } else if (gestureY < orderY - offset) {
      return "ITEM_MOVED_UP";
    } else if (gestureY > orderY + offset) {
      return "ITEM_MOVED_DOWN";
    }
  };

  // Handle gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderStart: () => setDraggingItem(true),
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dy: pan.y,
        },
      ],
      {
        useNativeDriver: false,
        listener: (event, gestureState) =>
          // console.log(movedOutsideOfOrderPosition(gestureState)),
          {
            const hasMoved = movedOutsideOfOrderPosition(gestureState);
            if (hasMoved) {
              // reorder the items
              console.log("REORDER " + hasMoved);
              props.reorder(props.order, hasMoved);
              // if (hasMoved === "ITEM_MOVED_UP") {
              //   props.reorder()
              // } else if (hasMoved === "ITEM_MOVED_DOWN") {
              // }
            }
          },
      }
    ),
    onPanResponderRelease: (e, gesture) => {
      // props.reorder();
      setDraggingItem(false);
      const moveToValue = props.orderPositionY - defaultPositionY;
      console.log(props.orderPositionY + " " + defaultPositionY);
      Animated.spring(pan, {
        toValue: { x: 0, y: moveToValue },
        // this line is needed, only works on false for some reason
        useNativeDriver: false,
      }).start();
    },
  });

  // styles in the function to have access to props
  const styles = StyleSheet.create({
    text: {
      marginTop: 25,
      marginLeft: 5,
      marginRight: 5,
      textAlign: "center",
      color: "#fff",
    },
    draggableContainer: {
      position: "absolute",
      // top: Window.height / 2 - ITEM_HEIGHT / 2,
      // -------------------
      top: defaultPositionY - ITEM_HEIGHT / 2,
      left: 0,
      // transform: [{ transformY: props.transformTest }],
    },
    item: {
      backgroundColor: "cyan",
      width: Window.width,
      height: ITEM_HEIGHT,
    },
  });

  // pan.getLayout() return left and top properties with the correct values for each frame during animation
  return (
    <View style={styles.draggableContainer}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[pan.getLayout(), styles.item]}
      >
        <Text style={styles.text}>{props.itemInfo}</Text>
      </Animated.View>
    </View>
  );
}
