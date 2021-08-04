const selectedExercisesReducer = (state = [], action) => {
  switch (action.type) {
    case "FETCH_SELECTED_EXERCISES":
      return action.payload ? action.payload : state;
    default:
      return state;
  }
};

export default selectedExercisesReducer;
