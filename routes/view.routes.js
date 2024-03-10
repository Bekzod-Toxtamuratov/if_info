const { Router } = require("express");

const { createViewPath } = require("../helpers/create_view_path");

const router = Router();

router.get("/", (req, res) => {
  res.render(createViewPath("index"), {
    title: "Asosit sahifa",
    isHome: true, // classda menu active qilish uchun kerak;
  });
});

router.get("/dictionary", (req, res) => {
  res.render(createViewPath("dictionary"), {
    title: "Lugatlar",
    isDict: true,
  });
});
router.get("/topics", (req, res) => {
  res.render(createViewPath("topics"), {
    title: "Maqolalar",
    isTopic: true,
  });
});

router.get("/authors", (req, res) => {
  res.render(createViewPath("authors"), {
    title: "Avtorlar",
    isAuthors: true,
  });
});

router.get("/login", (req, res) => {
  res.render(createViewPath("login"), {
    title: "login",
    isAuthors: true,
  });
});

module.exports = router;
