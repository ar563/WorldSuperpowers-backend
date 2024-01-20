module.exports = {
  passphrase: (data) =>
    (() => {
      const keyAndPassphrase = (data, "your_passphrase");
      return keyAndPassphrase;
    })(),
  filePath: "./private/private.key",
  token: "your_admin_jwt_token",
};
