const { Router } = require("express");

const {
  addTerm,
  getTermByTerm,
  getTermsById,
  getTermsByletter,
  getAllTerms,
  getTermByTermSearch,
  deleteDictionaryByid,
  updateDictionaryByid,
} = require("../controllers/dictionary.controller");

const router = Router();

router.get("/", getAllTerms);
router.get("/letter/:letter", getTermsByletter);
router.get("/term/:term", getTermByTerm);
router.get("/search", getTermByTermSearch);
router.post("/", addTerm);

router.put("/:id",updateDictionaryByid)
router.delete("/:id", deleteDictionaryByid);

router.get("/:id", getTermsById);
module.exports = router;
