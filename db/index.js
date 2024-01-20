const { Pool } = require("pg");
const logger = require("../utils/logger");

const pool = new Pool({
  connectionString:
    "postgresql://worldsuperpowers1:I4bGzC9sMCbyLPs@localhost:5432/worldsuperpowers",
});

module.exports = {
  async query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.info("executed query", {
      message: JSON.stringify({ text, duration, rows: res?.rowCount }),
    });
    return res;
  },
  async getClient() {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      logger.error("A client has been checked out for more than 5 seconds!");
      logger.error(
        `The last executed query on this client was: ${client.lastQuery}`,
      );
    }, 5000);
    // monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };
    client.release = () => {
      // clear our timeout
      clearTimeout(timeout);
      // set the methods back to their old un-monkey-patched version
      client.query = query;
      client.release = release;
      return release.apply(client);
    };
    return client;
  },
};
