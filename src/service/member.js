const memberRepository = require("../repository/member");

/**
 *
 * @param {number} partyId
 * @param {string} name
 * @param {string} user_id
 * @param {string} character_name
 * @param {number} role
 * @returns {number}
 */
const addMember = async (partyId, name, user_id, character_name, role) => {
  const insertId = memberRepository.addMember(
    partyId,
    name,
    user_id,
    character_name,
    role
  );
  return insertId;
};

/**
 *
 * @param {number} partyId
 * @returns
 */
const findByParty = async (partyId) => {
  const result = await memberRepository.findByParty(partyId);
  return result;
};

/**
 *
 * @param {number} partyId
 * @param {string} userId
 * @returns
 */
const deleteByPartyAndUser = async (partyId, userId) => {
  const result = memberRepository.deleteByPartyAndUser(partyId, userId);
  return result;
};

const memberService = {
  addMember,
  findByParty,
  deleteByPartyAndUser,
};

module.exports = memberService;
