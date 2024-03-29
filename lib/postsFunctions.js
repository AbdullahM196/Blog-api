const pool = require("../config/connectDb");
async function getPostById(id) {
  const [rows] = await pool.query("SELECT * FROM posts WHERE _id=?", [id]);
  if (rows === undefined || rows.length === 0) {
    return null;
  }
  return rows[0];
}
module.exports = { getPostById };
