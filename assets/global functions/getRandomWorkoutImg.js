export const images = {
  workou1: require("../../images/generalWorkout/workout1.jpg"),
  workou2: require("../../images/generalWorkout/workout2.jpg"),
  workou3: require("../../images/generalWorkout/workout3.jpg"),
  workou4: require("../../images/generalWorkout/workout4.jpg"),
  workou5: require("../../images/generalWorkout/workout5.jpg"),
  workou6: require("../../images/generalWorkout/workout6.jpg"),
  workou7: require("../../images/generalWorkout/workout7.jpg"),
  workou8: require("../../images/generalWorkout/workout8.jpg"),
  workou9: require("../../images/generalWorkout/workout9.jpg"),
  workou10: require("../../images/generalWorkout/workout10.jpg"),
};

export const getRandomWorkoutImg = () => {
  const index =
    Object.keys(images)[Math.floor(Math.random() * Object.keys(images).length)];
  return images[index];
};
