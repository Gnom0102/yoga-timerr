export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} мин`;
  }

  return `${minutes} мин ${remainingSeconds} сек`;
};
