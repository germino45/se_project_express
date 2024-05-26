const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

const { updateUserValidator } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUserValidator, updateCurrentUser);

module.exports = router;
