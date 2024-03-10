const { Router } = require("express");

const dictRouter = require("./dict.routes");
const descriptionRouter = require("./description.routes");

const authorRouter = require("./author.routes");
const categoryRouter = require("./category.routes");
const adminRouter = require("./admin.routes");
const userRouter = require("./user.routes");
const sysnonymRouter = require("./synonym.routes");
const topicRouter = require("./topic.routes");

const router = Router();
router.use("/dict", dictRouter);
router.use("/author", authorRouter);
router.use("/category", categoryRouter);
router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/desc", descriptionRouter);
router.use("/synonym", sysnonymRouter);
router.use("/topic", topicRouter);
module.exports = router;
