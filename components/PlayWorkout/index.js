import React, { useEffect, useState } from "react";
import { Text } from "react-native";

import PlayExercise from "../PlayExercise";
import Break from "./Break";
import SuccessModal from "./SuccessModal";

function PlayWorkout(props) {
  const { workout } = props.route.params;
  const { exercises } = workout;

  const idArray = Object.keys(exercises).map((i) => exercises[i].info.id);
  const maxIndex = idArray.length - 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [minReached, setMinReached] = useState(true);
  const [currentID, setCurrentID] = useState(idArray[0]);

  // Info for Break Component
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakType, setBreakType] = useState(undefined);
  const [currentBreakTime, setCurrentBreakTime] = useState(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [comingExercise, setComingExercise] = useState(undefined);

  // Modal congratulating for the completion of the workout
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const sets = exercises[currentIndex].reps
    ? exercises[currentIndex].reps
    : workout.generalInfo.defaultReps;

  const previousExercise = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      if (newIndex < 0) {
        setMinReached(true);
        return prevIndex;
      } else {
        setMinReached(newIndex === 0 ? true : false);
        return newIndex;
      }
    });
  };

  const handleNextExercise = () => {
    if (
      currentIndex + 2 <= idArray.length &&
      (sets === 1 || currentSet > sets)
    ) {
      setCurrentSet(1);
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        if (newIndex > maxIndex) {
          setMinReached(false);
          return prevIndex;
        } else if (newIndex < 0) {
          setMinReached(true);
          return prevIndex;
        } else {
          setMinReached(newIndex === 0 ? true : false);
          return newIndex;
        }
      });
    } else if ((currentSet <= sets) & (sets > 1)) {
      // do nothing; next set
    } else {
      setSuccessModalVisible(true);
    }
    setIsBreakActive(false);
  };

  const nextBreak = () => {
    let breakTime;
    if ((sets > 1) & (currentSet !== sets)) {
      const { timeBetweenSets } = exercises[currentIndex];
      breakTime =
        timeBetweenSets || timeBetweenSets === 0
          ? timeBetweenSets
          : workout.generalInfo.defaultTimeBetweenSets;

      // If exercise finished:
      setBreakType("TimeBetweenSets");
      setCurrentSet((prevState) => prevState + 1);
      console.log("SET TO Go");
      setComingExercise(idArray[currentIndex]);
    } else {
      const { timeBetweenExercises } = exercises[currentIndex];
      breakTime =
        timeBetweenExercises || timeBetweenExercises === 0
          ? timeBetweenExercises
          : workout.generalInfo.defaultTimeBetweenExercises;

      setBreakType("TimeBetweenExercises");
      setCurrentSet((prevState) => prevState + 1);
      setComingExercise(
        currentIndex + 1 >= idArray.length ? null : idArray[currentIndex + 1]
      );
    }
    setCurrentBreakTime(breakTime);
    setIsBreakActive(true);
  };

  useEffect(() => {
    setCurrentID(idArray[currentIndex]);
  }, [currentIndex]);

  return (
    <>
      <SuccessModal
        modalVisible={successModalVisible}
        setModalVisible={setSuccessModalVisible}
        navigation={props.navigation}
      />

      {isBreakActive ? (
        <Break
          breakType={breakType}
          time={currentBreakTime}
          comingExercise={comingExercise}
          handleNextExercise={handleNextExercise}
          currentSetInfo={`${currentSet}/${sets}`}
          currentExerciseInfo={`${currentIndex + 1}/${idArray.length}`}
        />
      ) : (
        <PlayExercise
          id={currentID}
          workout={true}
          nextExercise={nextBreak}
          previousExercise={previousExercise}
          minReached={minReached}
          currentSetInfo={`${currentSet}/${sets}`}
          currentExerciseInfo={`${currentIndex + 1}/${idArray.length}`}
        />
      )}
    </>
  );
}

export default PlayWorkout;
