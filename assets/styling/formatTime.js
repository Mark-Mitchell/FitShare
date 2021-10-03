const formatTime = (time) => {
  const minutes = (time - (time % 60)) / 60;
  const seconds = time - 60 * minutes;
  return minutes + " min " + seconds + " s";
};

export default formatTime;
