const connection = require("../config/connection");

/**
 *
 * @param {number} partyId
 * @param {string} name
 * @param {string} user_id
 * @param {string} character_name
 * @param {number} role
 * @returns {Promise<{insertId:number}>}
 */
const addMember = async (partyId, name, user_id, character_name, role) => {
  try {
    const [result, field] = await connection.query(
      "INSERT INTO member (`party_id`, `name`, `user_id`, `character_name`, `role`) VALUES (?)",
      [[partyId, name, user_id, character_name, role]]
    );
    return { insertId: result.insertId };
  } catch (e) {
    console.log(e);
  }
};

/**
 *
 * @param {number} partyId
 * @returns {Promise<{dealer:{name:string, user_id:string, character_name:string}[], supporter: {name:string, user_id:string, character_name:string}[]}>}
 */
const findByParty = async (partyId) => {
  try {
    const [dealerMemberResult, dealerMemberField] = await connection.query(
      "SELECT `name`,`user_id`,`character_name` FROM member WHERE party_id = ? and role = 0",
      [partyId]
    );
    const [supporterMemberResult, supporterMemberField] =
      await connection.query(
        "SELECT `name`,`user_id`,`character_name` FROM member WHERE party_id = ? and role = 1",
        [partyId]
      );
    return {
      dealer: dealerMemberResult,
      supporter: supporterMemberResult,
    };
  } catch (e) {
    console.log(e);
  }
};

/**
 *
 * @param {number} partyId
 * @param {number} userId
 * @returns {Promise<{affectedRows:number}>}
 */
const deleteByPartyAndUser = async (partyId, userId) => {
  try {
    const [result, field] = await connection.query(
      "DELETE FROM member WHERE party_id = ? and user_id = ?",
      [partyId, userId]
    );
    return { affectedRows: result.affectedRows };
  } catch (e) {
    console.log(e);
  }
};

const memberRepository = {
  addMember,
  findByParty,
  deleteByPartyAndUser,
};

module.exports = memberRepository;
