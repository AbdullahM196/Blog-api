const pool = require("../config/connectDb");

const getCategoryById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM Category WHERE _id=?", [id]);
  if (rows === undefined || rows.length === 0) {
    return null;
  }
  return rows[0];
};
const getCategoryByName = async (name) => {
  const [rows] = await pool.query("SELECT * FROM Category WHERE name=?", [
    name,
  ]);
  if (rows === undefined || rows.length === 0) {
    return null;
  }
  return rows[0];
};

module.exports = { getCategoryById, getCategoryByName };
