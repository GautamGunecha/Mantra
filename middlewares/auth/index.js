// model
const Users = require("../../models/users");

// services
const { verifyUserAccessToken } = require("../../services/jwt");
const logger = require("../../services/logger");

const auth = async (req, res, next) => {
  try {
    logger("Validating user access - middleware");
    const token = req.header("Authorization");
    if (!token) throw new Error("Unauthorized access.");

    logger("Validating token received - middleware!");
    const validateToken = verifyUserAccessToken(token);
    const { id } = validateToken;
    if (!id) throw new Error("Access denied.");

    logger("Finding user in mantra system - middleware");
    const user = await Users.findOne({
      _id: id,
    });

    if (!user) throw new Error("Access denied");
    logger("User found - middleware", user);

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

const admin = async (req, res, next) => {
  try {
    next();
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

module.exports = { auth, admin };
