const selectedExercisesReducer = (state = ["Ex 1", "Ex 2", "Ex 3"], action) => {
  switch (action.type) {
    case "FETCH_SELECTED_EXERCISES":
      return action.payload ? action.payload : state;
    default:
      return state;
  }
};

export default selectedExercisesReducer;
