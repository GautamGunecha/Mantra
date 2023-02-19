// models
const Users = require("../../models/users");

// services
const logger = require("../../services/logger");
const {} = require("../../services/jwt");

const getUserInfo = async (req, res, next) => {
  try {
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
};
