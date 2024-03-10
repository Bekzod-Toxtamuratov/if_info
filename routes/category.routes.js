const { Router } = require("express");

const {
  addTCategory,
  getAllCategories,
  getCategoriesById,
  getCategoryByName,
  deleteCategoryByid,
  updateCategoryByid,
} = require("../controllers/category.controller.js");

const router = Router();

router.get("/", getAllCategories);
router.get("/name/:name", getCategoryByName);
router.get("/:id", getCategoriesById);

// crud
router.delete("/:id", deleteCategoryByid);
router.put("/:id", updateCategoryByid);

router.post("/", addTCategory);

module.exports = router;
