function timeParesr(datetime = "0000:00:00 00:00:00"){
  const [date, time] = datetime.split(' ');
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes,seconds] = time.split(':').map(Number);

  // 예약 시간 설정
  const scheduledTime = new Date(year, month - 1, day, hours, minutes, 0, 0);

  // 현재 시간
  const now = new Date();

  // 현재 시간부터 예약 시간까지 대기
  const delay = scheduledTime - now;

  console.log(delay)

  if (delay <= 0) {
    return;
  }
  return delay;
}

module.exports =timeParesr;