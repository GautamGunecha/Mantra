const jwt = require("jsonwebtoken");

/**
 * Generate required token sets
 * @param { Object } payload takes required data inorder to encrypt.
 * @returns generated token
 */

const userActivationToken = (payload) =>
  jwt.sign(payload, process.env.USER_ACTIVATION_TOKEN, {
    expiresIn: "3m",
  });

const userAccessToken = (payload) =>
  jwt.sign(payload, process.env.USER_ACCESS_TOKEN, {
    expiresIn: "15m",
  });

const userRefreshToken = (payload) =>
  jwt.sign(payload, process.env.USER_REFRESH_TOKEN, {
    expiresIn: "15m",
  });

/**
 * Verify generated token sets.
 * @param {String} payload - takes previously generated token and verify that.
 * @returns {Boolean}
 */

const verifyUserActivationToken = (activationToken = "") =>
  jwt.verify(activationToken, process.env.USER_ACTIVATION_TOKEN);

const verifyUserAccessToken = (token) =>
  jwt.verify(token, process.env.USER_ACTIVATION_TOKEN);

const verifyUserRefreshToken = (token) =>
  jwt.verify(token, process.env.USER_REFRESH_TOKEN);

module.exports = {
  userActivationToken,
  userAccessToken,
  userRefreshToken,
  verifyUserAccessToken,
  verifyUserActivationToken,
  verifyUserRefreshToken,
};
