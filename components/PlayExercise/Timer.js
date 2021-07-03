// Gives Error on web, but works
import React from "react";
import { Animated } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

function Timer() {
  return (
    <CountdownCircleTimer
      isPlaying
      duration={10}
      colors={[
        ["#A30000", 0.4],
        ["#004777", 0.4],
        ["#0b8717", 0.2],
      ]}
      onComplete={() => [false]}
    >
      {({ remainingTime, animatedColor }) => (
        <Animated.Text style={{ color: animatedColor, fontSize: 40 }}>
          {remainingTime}
        </Animated.Text>
      )}
    </CountdownCircleTimer>
  );
}

export default Timer;
