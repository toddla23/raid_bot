const partyRepository = require("../repository/party");
const memberService = require("./member");

/**
 *
 * @param {string} guildId
 * @param {number} contentId
 * @param {string} name
 * @param {string} startTime
 * @returns
 */
const addParty = async (guildId, contentId, name, startTime) => {
  const insertId = await partyRepository.addParty(
    guildId,
    contentId,
    name,
    startTime
  );
  const result = await partyRepository.findById(insertId.insertId);
  console.log(result)
  return result;
};

/**
 *
 * @param {number} partyId
 * @returns
 */
const deleteById = async (partyId) => {
  const result = await partyRepository.deleteById(partyId);
  return result;
};

/**
 * 현개 기준 +7일까지 조회
 * @param {string} guildId
 * @returns
 */
const findAllParty = async (guildId) => {
  const partys = await partyRepository.findAllParty(guildId);
  const result = await Promise.all(
    partys.map(async (party) => {
      const members = await memberService.findByParty(party.id);
      return {
        party,
        members,
      };
    })
  );
  return result;
};

/**
 *
 * @param {string} guildId
 * @param {string} userId
 * @returns
 */
const findByUserId = async (guildId, userId) => {
  const partys = await partyRepository.findByUserId(guildId, userId);
  const result = await Promise.all(
    partys.map(async (party) => {
      const members = await memberService.findByParty(party.id);
      return {
        party,
        members,
      };
    })
  );
  return result;
};

/**
 *
 * @param {string} guildId
 * @param {string} name
 * @returns {Promise<{id:number, contents:string, party_name:string, start_time:Date, cnt:number}[]>}
 */
const findByName = async (guildId, name) => {
  const result = await partyRepository.findByName(guildId, name);

  return result;
};


const partyService = {
  addParty,
  findAllParty,
  findByUserId,
  deleteById,
  findByName
};

module.exports = partyService;
