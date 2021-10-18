import { combineReducers } from "redux";

import exercisesReducer from "./exercises";
import equipmentPickerReducer from "./equipmentPicker";
import selectedExercisesReducer from "./selectedExercises";
import workoutsReducer from "./workouts";
import defaultExercisesReducer from "./defaultExercises";

const allReducers = combineReducers({
  exercises: exercisesReducer,
  equipmentPicker: equipmentPickerReducer,
  selectedExercises: selectedExercisesReducer,
  workouts: workoutsReducer,
  defaultExercises: defaultExercisesReducer,
});

export default allReducers;
