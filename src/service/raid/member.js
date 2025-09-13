const connection = require("../../config/connection");

const addMember = async (partyId, name, user_id, character_name, role) => {
  try {
    const [result, field] = await connection.query(
      "INSERT INTO member (`party_id`, `name`, `user_id`, `character_name`, `role`) VALUES (?)",
      [[partyId, name, user_id, character_name, role]]
    );
    return result;
  } catch (e) {
    console.log(e);
  }
};
const findByParty = async (partyId) => {
  try {
    const [partyResult, partyField] = await connection.query(
      "SELECT p.id, c.name, p.party_name FROM contents c, party p WHERE c.id = p.contents_id AND p.id = ?",
      [partyId]
    );
    const [dealerMemberResult, dealerMemberField] = await connection.query(
      "SELECT `name` FROM member WHERE party_id = ? and role = 0",
      [partyId]
    );
    const [supporterMemberResult, supporterMemberField] =
      await connection.query(
        "SELECT `name` FROM member WHERE party_id = ? and role = 1",
        [partyId]
      );
    if (partyResult.length !== 1) return;

    const partyResultString = `ID: ${partyResult[0].id} \n파티명: ${partyResult[0].party_name}\n레이드: ${partyResult[0].name}`;
    const dealerMemberResultString = dealerMemberResult.reduce((acc, cur) => {
      return acc + `${cur.name}, `;
    }, "딜러: ");
    const supporterMemberResultString = supporterMemberResult.reduce(
      (acc, cur) => {
        return acc + `${cur.name}, `;
      },
      "서폿: "
    );
    const result = {
      party: partyResult[0],
      dealer: dealerMemberResult,
      supporter: supporterMemberResult,
    };
    return result;

    // return partyResultString + "\n" + dealerMemberResultString + "\n" + supporterMemberResultString;
  } catch (e) {
    console.log(e);
  }
};

const findUserIdByParty = async (partyId) => {
  try {
    const [partyResult, partyField] = await connection.query(
      "SELECT p.id, c.name, p.party_name FROM contents c, party p WHERE c.id = p.contents_id AND p.id = ?",
      [partyId]
    );
    const [dealerMemberResult, dealerMemberField] = await connection.query(
      "SELECT `user_id` FROM member WHERE party_id = ? and role = 0",
      [partyId]
    );
    const [supporterMemberResult, supporterMemberField] =
      await connection.query(
        "SELECT `user_id` FROM member WHERE party_id = ? and role = 1",
        [partyId]
      );
    if (partyResult.length !== 1) return;

    const partyResultString = `ID: ${partyResult[0].id} \n파티명: ${partyResult[0].party_name}\n레이드: ${partyResult[0].name}`;
    const dealerMemberResultString = dealerMemberResult.reduce((acc, cur) => {
      return acc + `${cur.user_id}, `;
    }, "딜러: ");
    const supporterMemberResultString = supporterMemberResult.reduce(
      (acc, cur) => {
        return acc + `${cur.user_id}, `;
      },
      "서폿: "
    );
    const result = {
      party: partyResult[0],
      dealer: dealerMemberResult,
      supporter: supporterMemberResult,
    };
    return result;

    // return partyResultString + "\n" + dealerMemberResultString + "\n" + supporterMemberResultString;
  } catch (e) {
    console.log(e);
  }
};

const deleteByPartyAndName = async (partyId, userId) => {
  try {
    const [result, field] = await connection.query(
      "DELETE FROM member WHERE party_id = ? and user_id = ?",
      [partyId, userId]
    );
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
};

const memberService = {
  addMember,
  findByParty,
  deleteByPartyAndName,
  findUserIdByParty,
};

module.exports = memberService;
