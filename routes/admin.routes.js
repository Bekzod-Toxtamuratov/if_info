const { Router } = require("express");

const {
  addAdmin,
  getAllAdmin,
  updateAdminByid,
  getAdminById,
  getAdminByName,
  deleteAdminByid,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
} = require("../controllers/admin.controller");


const adminPolice = require("../middleware/admin_police");

const router = Router();

router.get("/", adminPolice, getAllAdmin);
router.get("/:id", adminPolice, getAdminById);
router.get("/name/:name", getAdminByName);



router.delete("/:id", deleteAdminByid);
router.put("/:id", updateAdminByid);


router.post("/", addAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshAdminToken);


module.exports = router;
