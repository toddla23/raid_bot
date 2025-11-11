const connection = require("../config/connection");

const addBbsId = async (guildId, bbsId) => {
  try {
    const [result, field] = await connection.query(
      "INSERT INTO bbs (`guild_id`, `bbs_id`) VALUES (?)",
      [[guildId, bbsId]]
    );
    return result;
  } catch (e) {
    console.log(e);
  }
};

const updateBbsIdByGuildId = async (guildId, bbsId) => {
  try {
    const [result, field] = await connection.query(
      "UPDATE bbs SET bbs_id = ? WHERE guild_id = ?",
      [bbsId, guildId]
    );
    return result;
  } catch (e) {
    console.log(e);
  }
};

const findBbsIdByGuildId = async (guildId) => {
  try {
    const [[result], field] = await connection.query(
      "SELECT bbs_id FROM bbs WHERE guild_id = ?",
      [guildId]
    );
    return result;
  } catch (e) {
    console.log(e);
  }
};

const bbsService = { addBbsId, updateBbsIdByGuildId, findBbsIdByGuildId };
module.exports = bbsService;
