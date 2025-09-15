function formatDateWithKoreanDay(date) {
  const koreanDays = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = koreanDays[date.getDay()];

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  return `${month}.${day} (${dayOfWeek}) ${hour}:${minute}`;
}

module.exports = formatDateWithKoreanDay;