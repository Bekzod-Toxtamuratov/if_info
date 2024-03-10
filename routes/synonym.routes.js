const { Router } = require("express");
const {
  addSynonym,
  getSynonymById,
  getAllSynonym,
  deleteSynonymByid,
} = require("../controllers/synonym.controller");

const router = Router();

router.get("/", getAllSynonym);
router.get("/:id", getSynonymById);

router.post("/", addSynonym);
router.delete("/:id", deleteSynonymByid);

module.exports = router;
