const connection = require("../../config/connection");

/**
 *
 * @param {number} id
 * @returns {Promise<{id:number, name:string, max_member:number}>}
 */
const findById = async (id) => {
  try {
    const [result, field] = await connection.query(
      "SELECT * FROM contents WHERE id = ?",
      [id]
    );
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
};

const contentsService = { findById };
module.exports = contentsService;
