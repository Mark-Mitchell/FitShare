const generateId = (object) => {
  const idArray = Object.keys(object);
  return idArray.length > 0 ? Math.max(...idArray) + 1 : 1;
};

export default generateId;
