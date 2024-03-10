const { Router } = require("express");
const {
  addUser,
  getAllUser,
  getUserById,
  getUserByName,
  updateUserByid,
  deleteUserByid,
  loginUser,
  logoutUser,
  refreshUserToken,
} = require("../controllers/user.controller");

const userPolice = require("../middleware/user_police");

const router = Router();

router.put("/:id",updateUserByid);
router.delete("/:id",deleteUserByid);


router.get("/",userPolice, getAllUser);
router.get("/:id",userPolice, getUserById);
router.get("/name/:name",getUserByName);



router.post("/", addUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh",refreshUserToken)

module.exports = router;
