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
} = require("../controllers/auth");

// authentication routing
router.post("/register", create);
router.post("/validate", validate);

router.post("/login", login);
router.post("/access-token", generateAccessToken);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/logout", logout);

module.exports = router;
