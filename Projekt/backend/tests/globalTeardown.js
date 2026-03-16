const pool = require("../database/pool/pool");

module.exports = async () => {
  await pool.end();
};

