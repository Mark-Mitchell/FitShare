import { combineReducers } from "redux";

import exercisesReducer from "./exercises";
import equipmentPickerReducer from "./equipmentPicker";
import selectedExercisesReducer from "./selectedExercises";
import workoutsReducer from "./workouts";

const allReducers = combineReducers({
  exercises: exercisesReducer,
  equipmentPicker: equipmentPickerReducer,
  selectedExercises: selectedExercisesReducer,
  workouts: workoutsReducer,
});

export default allReducers;
