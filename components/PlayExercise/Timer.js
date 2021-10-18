// Gives Error on web, but works
import React, { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import formatTime from "../../assets/styling/formatTime";

const onComplete = () => {
  return [false];
};

function Timer(props) {
  const [duration, setDuration] = useState(
    props.duration === -1 ? 1000 : props.duration
  );

  useEffect(() => {
    setDuration(props.duration);
  }, [props.duration]);

  const onComplete = props.onComplete ? props.onComplete : () => [false];

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <CountdownCircleTimer
        isPlaying={props.playing}
        duration={duration}
        colors={[
          ["#A30000", 0.4],
          ["#004777", 0.4],
          ["#0b8717", 0.2],
        ]}
        onComplete={() => onComplete()}
      >
        {({ remainingTime, animatedColor }) => (
          <Animated.Text style={{ color: animatedColor, fontSize: 25 }}>
            {formatTime(remainingTime)}
          </Animated.Text>
        )}
      </CountdownCircleTimer>
    </View>
  );
}

export default Timer;
