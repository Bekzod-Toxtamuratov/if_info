

const { Router } = require("express");
const {
  addAuthor,
  getAllAuthor,
  getAuthorById,
  getAuthorByName,
  deleteAuthorByid,
  updateAuthorByid,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  authorActivate,
} = require("../controllers/author.controller");

const {
  getTermByTerm,
  addTerm,
} = require("../controllers/dictionary.controller");

const authorPolice = require("../middleware/author_police");
const authorRolesPolice = require("../middleware/author_roles_police");

const express = require("express");

const router = Router();

express.Router.prefix = function (path, subRouter) {
  const router = express.Router();
  this.use[(path, router)];
  subRouter(router);
  return router;
};

router.prefix("/", (authorRoute) => {
  authorRoute.get("/", authorPolice, getAllAuthor);
  authorRoute.get(
    "/:id",
    authorRolesPolice(["WRITE", "DELETE"]),
    getAuthorById
  );

  authorRoute.post("/author", addAuthor);
  authorRoute.post("/login", loginAuthor);
  authorRoute.post("/logout", logoutAuthor);
  authorRoute.post("/refresh", refreshAuthorToken);
  authorRoute.get("/activate/:link", authorActivate);
  authorRoute.delete("/:id", deleteAuthorByid);

  authorRoute.prefix("/dict", (authorDictRouter) => {
    // authorDictRouter.get("/search/", authorPolice, getTermByTerm);
    authorDictRouter.post("/", authorPolice, addTerm);
  });
  authorRoute.prefix("/dict", (authorTopicRouter) => {
    // authorTopicRouter.get("/search", authorPolice, getTermByTerm);
    authorTopicRouter.post("/", authorPolice, addTerm);
  });
});

router.put("/:id",updateAuthorByid);
router.delete("/:id", deleteAuthorByid);
router.get("/", authorPolice, getAllAuthor);
router.get("/:id", authorRolesPolice(["WRITE", "DELETE"]), getAuthorById);
router.get("/name/:name", getAuthorByName);
router.post("/login", loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshAuthorToken);
router.get("/activation/:link", authorActivate);
router.post("/", addAuthor);

module.exports = router;
