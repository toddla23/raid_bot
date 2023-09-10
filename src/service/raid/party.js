const connection = require("../../config/connection");


const addParty = async (contentId, name, startTime) => {
  try {
    const [result, field] = await connection.query("INSERT INTO party (`contents_id`, `party_name`, `start_time`) VALUES  (?)", [[contentId, name, startTime]]);
    return result;
  } catch (e) {
    console.log(e)
  }
}
// { id: 1, name: '쿠크세이튼 노말', party_name: '생임이네 쿠크파티' },
// { id: 2, name: '발탄 노말', party_name: 'test' }


const findAllParty = async () => {
  try {
    let tempResult;
    const now = new Date();
    console.log(dateFormat(now))
    // if (now.getDay() == 1) {
    //   // console.log("a")
    //   const [result, field] = await connection.query("SELECT id, contents, party_name, start_time, cnt FROM party_member_count where start_time BETWEEN ? and ?", [dateFormat(now), dateFormat(new Date(now.setDate(now.getDate() + 10)))]);
    //   tempResult = result;
    // } else if (now.getDay() == 2) {
    //   // console.log("b")
    //   const [result, field] = await connection.query("SELECT id, contents, party_name, start_time, cnt FROM party_member_count where start_time BETWEEN ? and ?", [dateFormat(now), dateFormat(new Date(now.setDate(now.getDate() + 9)))]);
    //   tempResult = result;
    // } else {
    //   // console.log("c")
    //   const [result, field] = await connection.query("SELECT id, contents, party_name, start_time, cnt FROM party_member_count where start_time BETWEEN ? and ?", [dateFormat(now), dateFormat(new Date(now.setDate(now.getDate() + 10 - now.getDay())))]);
    //   tempResult = result;
    // }
    const [result, field] = await connection.query("SELECT id, contents, party_name, start_time, cnt FROM party_member_count where start_time BETWEEN ? and ?", [dateFormat(now), dateFormat(new Date(now.setDate(now.getDate() + 10)))]);
    tempResult = result;

    // console.log(tempResult)
    // const resultString = tempResult.reduce((acc, cur) => {
    //   const time = ` ${cur.start_time.getMonth() + 1}월 ${cur.start_time.getDate()}일 ${cur.start_time.getHours()}:${cur.start_time.getMinutes()}`;
    //   return acc + `ID: ${cur.id},       레이드: ${cur.contents},       파티명: ${cur.party_name},       시간:${time},       인원 수:${cur.cnt} \n`
    // }, "")
    return result;
  } catch (e) {
    console.log(e)
  }
}

const findByDay = async (dayNumber) => {
  let now = new Date();

  while(now.getDay() != dayNumber){
    now = new Date(now.setDate(now.getDate() + 1));
  }
  try{
    const [result, field] = await connection.query("SELECT id, contents, party_name, start_time, cnt FROM party_member_count where DATE(start_time) = ?", [dateFormat(now)]);
    console.log(result);
    // const resultString = result.reduce((acc, cur) => {
    //   const time = ` ${cur.start_time.getMonth() + 1}월 ${cur.start_time.getDate()}일 ${cur.start_time.getHours()}:${cur.start_time.getMinutes()}`;
    //   return acc + `ID: ${cur.id},       레이드: ${cur.contents},       파티명: ${cur.party_name},       시간:${time},       인원 수:${cur.cnt} \n`
    // }, "")

    return result;
  }catch (e) {
    console.log(e);
  }
}


function dateFormat(source) {
  return source.getFullYear() + "-" + (source.getMonth() + 1) + "-" + source.getDate() ;
}


const partyService = {addParty, findAllParty, findByDay};

module.exports = partyService;