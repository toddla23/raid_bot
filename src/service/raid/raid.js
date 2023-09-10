const connection = require("../../config/connection");


const findContentsById = (async (id) => {
  try {
    const [result, field] = await connection.query("SELECT * FROM contents WHERE id = ?", [id])
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
})


const raidService = {findContentsById}
module.exports = raidService;

