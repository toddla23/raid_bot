const connection = require("../config/connection");

/**
 * 파티 추가
 * @param {number} guildId
 * @param {number} contentId
 * @param {string} name
 * @param {string} startTime
 * @returns {Promise<{insertId: number}>}
 */
const addParty = async (guildId, contentId, name, startTime) => {
  try {
    const [result, field] = await connection.query(
      "INSERT INTO party (`guild_id`, `contents_id`, `party_name`, `start_time`) VALUES  (?)",
      [[guildId, contentId, name, startTime]]
    );
    return { insertId: result.insertId };
  } catch (e) {
    console.log(e);
  }
};

/**
 * @param {number} partyId
 * @returns {Promise<{affectedRows: number}>}
 */
const deleteById = async (partyId) => {
  try {
    const [result, field] = await connection.query(
      "DELETE FROM party WHERE id = ?",
      [[partyId]]
    );
    return { affectedRows: result.affectedRows };
  } catch (e) {
    console.log(e);
  }
};

/**
 * @param {number} id
 * @returns {Promise<{id:number, contents:string, party_name:string, start_time:Date, cnt:number}[]>}
 */
const findById = async (id) => {
  try {
    const [[result], field] = await connection.query(
      "SELECT id, contents, party_name, start_time, cnt FROM party_member_count WHERE id= ? ORDER BY start_time",
      [id]
    );
    return result;
  } catch (e) {
    console.log(e);
  }
};

/**
 * 현재일 기준 +7일 까지의 파티 조회
 * @param {string} guildId
 * @returns {Promise<{id:number, contents:string, party_name:string, start_time:Date, cnt:number}[]>}
 */
const findAllParty = async (guildId) => {
  try {
    const now = new Date();
    const [results, field] = await connection.query(
      "SELECT id, contents, party_name, start_time, cnt FROM party_member_count WHERE start_time BETWEEN ? and ? AND guild_id = ? ORDER BY start_time",
      [
        dateFormat(now),
        dateFormat(new Date(now.setDate(now.getDate() + 7))),
        guildId,
      ]
    );
    return results;
  } catch (e) {
    console.log(e);
  }
};
/**
 * 현재일 기준 +7일 까지의 파티 조회
 * @param {string} guildId
 * @returns {Promise<{id:number, contents:string, party_name:string, start_time:Date, cnt:number}[]>}
 */
const findByUserId = async (guildId, userId) => {
  try {
    const now = new Date();
    const [results, field] = await connection.query(
      "SELECT id, contents, party_name, start_time, cnt FROM party_member_count WHERE id in (SELECT party_id FROM member m WHERE user_id = ?) AND guild_id = ? AND  start_time BETWEEN ? and ? ORDER BY start_time",
      [
        userId,
        guildId,
        dateFormat(now),
        dateFormat(new Date(now.setDate(now.getDate() + 7))),
      ]
    );
    return results;
  } catch (e) {
    console.log(e);
  }
};

/**
 *
 * @param {string} guildId
 * @param {string} name
 * @returns {Promise<{id:number, contents:string, party_name:string, start_time:Date, cnt:number}[]>}
 */
const findByName = async (guildId, name) => {
  try {
    const now = new Date();
    const [results, field] = await connection.query(
      "SELECT id, contents, party_name, start_time, cnt FROM party_member_count WHERE guild_id = ? AND party_name like ? AND  start_time BETWEEN ? AND ? ORDER BY start_time",
      [
        guildId,
        "%" + name + "%",
        dateFormat(now),
        dateFormat(new Date(now.setDate(now.getDate() + 7))),
      ]
    );
    return results;
  } catch (e) {
    console.log(e);
  }
};
/**
 *
 * @param {string} dateString
 * @returns {Promise<{id:number, contents:string, party_name:string, start_time:Date, cnt:number}[]>}
 */
const findByDateTime = async (dateString) => {
  try {
    const [results, field] = await connection.query(
      "SELECT id, contents, party_name, start_time, cnt FROM party_member_count where start_time = ?",
      [dateString]
    );
    return results;
  } catch (e) {
    console.log(e);
  }
};

function dateFormat(source) {
  return (
    source.getFullYear() +
    "-" +
    (source.getMonth() + 1) +
    "-" +
    source.getDate()
  );
}

const partyRepository = {
  addParty,
  deleteById,
  findById,
  findAllParty,
  findByUserId,
  findByName,
  findByDateTime,
};

module.exports = partyRepository;
