const formatTime = (time, returnTimeObject = false) => {
  const minutes = (time - (time % 60)) / 60;
  const seconds = time - 60 * minutes;
  const output = minutes + " min " + seconds + " s";
  return returnTimeObject ? { minutes, seconds } : output;
};

export default formatTime;
