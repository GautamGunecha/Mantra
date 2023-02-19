const router = require("express").Router();

// auth route
const {
  create,
  login,
  generateAccessToken,
  logout,
  googleAuth,
  validate,
  forgotPassword,
  resetPassword,
  deleteUser,
} = require("../controllers/auth");

// users route
const { getUserInfo, updateUserInfo } = require("../controllers/users");

// middleware
const { auth, admin } = require("../middlewares/auth");

// authentication routing
router.post("/auth/register", create);
router.post("/auth/validate", validate);

router.post("/auth/login", login);
router.post("/auth/access-token", generateAccessToken);

router.post("/auth/forgot-password", forgotPassword);
router.put("/auth/reset-password", auth, resetPassword);

router.post("/auth/logout", auth, logout);
router.put("/auth/delete", auth, deleteUser);

// user
router.get("/user/get-user-info", auth, getUserInfo);
router.put("/user/update-user-info", auth, updateUserInfo);

module.exports = router;
