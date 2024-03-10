const { Router } = require("express");

const { addTopic, getAllTopics } = require("../controllers/topic.controller");

const router = Router();

router.post("/", addTopic);
router.get("/", getAllTopics);

module.exports = router;
