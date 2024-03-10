const { Router } = require("express");

const {
  addDescription,
  getAlldescription,
  getdescriptionById,
  getdescriptionByName,
  updatedescriptionByid,
  deletedescriptionByid,
} = require("../controllers/description.controller");

const router = Router();

router.post("/", addDescription);

router.get("/", getAlldescription);
router.get("/:id", getdescriptionById);
router.get("/name/:name", getdescriptionByName);

router.put("/:id", updatedescriptionByid);
router.delete("/:id", deletedescriptionByid);

module.exports = router;
