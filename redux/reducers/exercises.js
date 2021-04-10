const exercisesReducer = (state = {}, action) => {
  switch (action.type) {
    case "FETCH_LOCAL_DATA":
      return action.payload ? action.payload : state;
    default:
      return state;
  }
};

export default exercisesReducer;
