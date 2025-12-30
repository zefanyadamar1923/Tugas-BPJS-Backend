exports.getDatesInRange = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  const stopDate = new Date(endDate);

  while (currentDate <= stopDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
