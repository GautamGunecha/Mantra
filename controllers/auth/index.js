// models
const Users = require("../../models/users");

// external library.
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const {
  validateEmail,
  validatePassword,
} = require("../../configs/validations");

// services
const {
  userActivationToken,
  userAccessToken,
  userRefreshToken,
  verifyUserActivationToken,
  verifyUserRefreshToken,
  verifyUserAccessToken,
} = require("../../services/jwt");

const logger = require("../../services/logger");

/**
 * Create new user in our system.
 * @api { POST } mantra/api/auth/register
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const create = async (req, res, next) => {
  try {
    logger("Received request to create new user.", req.body);
    const { firstName = "", email = "", password = "" } = req.body;

    if (!req.body) throw new Error("Please provide required data.");
    if (!firstName || !email || !password)
      throw new Error("Please enter required fields.");

    const isEmail = validateEmail(email);
    if (!isEmail)
      throw new Error("Email is not valid! Please enter valid email address.");

    const isPassword = validatePassword(password);
    if (!isPassword.success) throw new Error(isPassword?.msg);

    const user = await Users.findOne({
      email,
    });

    if (user) throw new Error("Email Id already has been used.");

    const salt = await bcrypt.genSalt(13);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = {
      firstName,
      email,
      password: hashPassword,
    };

    const activationToken = userActivationToken(newUser);
    logger("Generated activation token", activationToken);

    return res.status(200).json({
      success: true,
      status: 201,
      message: "Please check email! To validation user credentials.",
      activationToken,
    });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

/**
 * Validate user information by decrypting salt user received in email.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const validate = async (req, res, next) => {
  try {
    logger("received activation token to validate email");

    const { activationToken } = req.body;
    if (!activationToken) throw new Error("Activation token not found!");

    const user = verifyUserActivationToken(activationToken);
    logger("Userdata decrypted", user);

    if (!user) throw new Error("Invalid activation token provided.");

    const { firstName, email, password } = user;

    const userId = uuidv4();
    logger("Generated unique userId", { userId });

    const newUser = new Users({
      firstName,
      email,
      password,
      userId,
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Activation Success! Please login.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const login = async (req, res, next) => {
  try {
    logger("Received login request from user", req.body);

    const { email = "", password = "" } = req.body;
    if (!req.body) throw new Error("Please provide required credentials.");

    if (!email || !password)
      throw new Error("Please enter required email address.");

    const user = await Users.findOne({ email });
    if (!user) throw new Error("User not found.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Incorrect password.");
    logger("User credentials verified. Generating refresh token.");

    const refreshToken = userRefreshToken({ id: user._id });
    logger("Generated refreshToken.", { refreshToken });

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      path: "/mantra/user/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Login Success!",
    });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

/** */
const generateAccessToken = async (req, res, next) => {
  try {
    logger("Received request to generated access token");

    const refreshToken = req.cookies.refreshtoken;
    logger("Refresh token received", refreshToken);

    const verifyRefreshToken = verifyUserRefreshToken(refreshToken);
    if (!verifyRefreshToken) throw new Error("Invalid user access.");

    const { id } = verifyRefreshToken;
    logger("User id decrypted", { id });

    const user = await Users.findOne(
      {
        _id: id,
      },
      {
        _id: 1,
        firstName: 1,
        email: 1,
      }
    );

    logger("User req for generating accesstoken", user);

    if (!user) throw new Error("User not found.");
    const accessToken = userAccessToken({ id: user?._id });

    logger("Access token for user generated", { accessToken });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Generated access token.",
      accessToken,
    });
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

/**
 *
 *
 *
 */

const forgotPassword = async (req, res, next) => {
  try {
    logger("Received request for forgot password", req.body);

    const { email } = req.body;
    if (!email) throw new Error("Please provide user email id.");

    logger("Finding user with email id", { email });

    const user = await Users.findOne({ email }, { _id: 1 });
    if (!user) throw new Error("Invalid user request.");

    logger("Regenerating access token");

    const accessToken = userAccessToken({ id: user?._id });
    logger("Access token generated for user", { accessToken });

    const { CLIENT_URL } = process.env;
    const url = `${CLIENT_URL}/mantra/password-reset/${accessToken}`;

    logger("Reset url generated for client", { url });

    // send email to registered user

    logger("Reset url sent to user.", { email });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Please check email to reset password.",
      url,
    });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    logger("Received request to reset password", req.body);

    const { body = {}, params = {} } = req;
    const { password = "" } = body;
    const { token } = params;

    if (!password || !token)
      throw new Error("Unauthorised access to reset password.");

    logger("Verifying received token set", { token });

    const verifyToken = verifyUserAccessToken(token);
    const { id } = verifyToken;

    const user = await Users.findOne({ _id: id }, { password: 1 });
    if (!user) throw new Error("User not found");

    res.status(200).json({
      success: true,
      status: 200,
      message: "Password reset success.",
    });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshtoken", { path: "/mantra/user/refresh-token" });
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Logged out.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const googleAuth = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.body;

    const user = await Users.findOne({ _id: id });
    await Object.assign(user, {
      status: "inactive",
    }).save();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  validate,

  login,
  generateAccessToken,

  forgotPassword,
  resetPassword,

  logout,
  googleAuth,
};
