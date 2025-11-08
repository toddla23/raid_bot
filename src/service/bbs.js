const connection = require("../config/connection");


const findBbsIdByGuildId = (async (guildId) => {
  try {
    const [[result], field] = await connection.query("SELECT bbs_id FROM bbs WHERE guild_id = ?", [guildId])
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
})


const bbsService = {findBbsIdByGuildId}
module.exports = bbsService;

