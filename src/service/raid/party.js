const connection = require("../../config/connection");


const addParty = async (contentId, name, startTime) => {
  try {
    const [result, field] = await connection.query("INSERT INTO party (`contents_id`, `party_name`, `start_time`) VALUES  (?)", [[contentId, name, startTime]]);
    return result;
  } catch (e) {
    console.log(e)
  }
}
const findAllParty = async () => {
  try {
    let tempResult;
    const now = new Date();
    const [results, field] = await connection.query("SELECT id, contents, party_name, start_time, cnt FROM party_member_count where start_time BETWEEN ? and ? ORDER BY start_time", [dateFormat(now), dateFormat(new Date(now.setDate(now.getDate() + 7)))]);
    const result = await Promise.all(results.map(async (result) => {
      const [dealers, dealerFields] = await connection.query("SELECT * from member WHERE party_id = ? and role = 0", [result.id]);
      const [supporters, supporterFields] = await connection.query("SELECT * from member WHERE party_id = ? and role = 1", [result.id]);
      return {... result, dealer:dealers.map(dealer => dealer.name), supporter: supporters.map(supporter => supporter.name)}
    }))
    return result;
  } catch (e) {
    console.log(e)
  }
}

const findAllPartyByContent = async (contentId) => {
  try {
    let tempResult;
    const now = new Date();
    const [results, field] = await connection.query("SELECT id, contents, party_name, start_time, cnt FROM party_member_count where contents_id = ? and  start_time BETWEEN ? and ? ORDER BY start_time", [contentId ,dateFormat(now), dateFormat(new Date(now.setDate(now.getDate() + 7)))]);
    const result = await Promise.all(results.map(async (result) => {
      const [dealers, dealerFields] = await connection.query("SELECT * from member WHERE party_id = ? and role = 0", [result.id]);
      const [supporters, supporterFields] = await connection.query("SELECT * from member WHERE party_id = ? and role = 1", [result.id]);
      return {... result, dealer:dealers.map(dealer => dealer.name), supporter: supporters.map(supporter => supporter.name)}
    }))
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
    const [results, field] = await connection.query("SELECT id, contents, party_name, start_time, cnt FROM party_member_count WHERE DATE(start_time) = ? ORDER BY start_time", [dateFormat(now)]);

    const result = await Promise.all(results.map(async (result) => {
      const [dealers, dealerFields] = await connection.query("SELECT * from member WHERE party_id = ? and role = 0", [result.id]);
      const [supporters, supporterFields] = await connection.query("SELECT * from member WHERE party_id = ? and role = 1", [result.id]);
      return {... result, dealer:dealers.map(dealer => dealer.name), supporter: supporters.map(supporter => supporter.name)}
    }))
    console.log(result);

    return result;
  }catch (e) {
    console.log(e);
  }
}


function dateFormat(source) {
  return source.getFullYear() + "-" + (source.getMonth() + 1) + "-" + source.getDate() ;
}


const partyService = {addParty, findAllParty, findByDay, findAllPartyByContent};

module.exports = partyService;