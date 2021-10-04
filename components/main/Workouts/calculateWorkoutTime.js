const calculateWorkoutTime = (workout, reduxExercises) => {
  const exercisesObject = workout.exercises;
  let totalTime = 0;
  for (let i = 0; i < Object.keys(exercisesObject).length; i++) {
    const id = exercisesObject[i].info.id;
    const exercise = reduxExercises[id];
    const isTimedExercise = exercise.time !== -1;

    const workoutReps = exercisesObject[i].reps ? exercisesObject[i].reps : 1;
    const timeBetweenSets =
      exercisesObject[i].timeBetweenSets ||
      exercisesObject[i].timeBetweenSets === 0
        ? exercisesObject[i].timeBetweenSets
        : workout.generalInfo.defaultTimeBetweenSets;
    const timeBetweenExercises =
      exercisesObject[i].timeBetweenExercises ||
      exercisesObject[i].timeBetweenExercises === 0
        ? exercisesObject[i].timeBetweenExercises
        : workout.generalInfo.defaultTimeBetweenExercises;

    // exercise time
    if (isTimedExercise) {
      totalTime += workoutReps * exercise.time;
    } else {
      totalTime += workoutReps * exercise.reps * 5;
    }
    // break time
    totalTime += (workoutReps - 1) * timeBetweenSets;
    totalTime += timeBetweenExercises;
  }
  return totalTime;
};

export default calculateWorkoutTime;
