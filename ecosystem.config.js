// change to your needs

const env = {
  DAMAGE_BONUS_CHANGE_DEADLINE: 1696355829000,
  CITIZENSHIP_CHANGE_DEADLINE: 1693763829000,
  TRAVEL_OIL_USAGE: 100,
};

const developmentEnv = {
  NODE_ENV: "development",
  PORT: 5000,
  HCAPTCHA_SECRET_KEY: "0x0000000000000000000000000000000000000000",
  ...env,
};

// fill with your hcaptcha secret key gathered from hcaptcha website

module.exports = {
  apps: [
    {
      name: "worldsuperpowers",
      script: "./bin/www",
      env: developmentEnv,
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
        HCAPTCHA_SECRET_KEY: "your_hcaptcha_secret_key",
        ...env,
      },
      env_development: developmentEnv,
    },
  ],
};
