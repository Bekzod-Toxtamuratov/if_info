const { to } = require("../helpers/to_promise");
const myJwt = require("../services/jwt_service");

module.exports = function (roles) {
  return async function (req, res, next) {
    try {
      const authorization = req.headers.authorization;

      if (!authorization) {
        return res.status(403).json({
          message: "Avto ro'yhatdan o'tganmagan (null authorizations)",
        });
      }
      const bearer = authorization.split(" ")[0];
      const token = authorization.split(" ")[1];

      if (bearer != "Bearer" || !token) {
        return res
          .status(403)
          .json({ message: "Avtor ro'yhatdan o'tmagan (token berilmagan)" });
      }
      const [error, devededToken] = await to(myJwt.verifyAccessToken(token));

      if (error) {
        return res.status(403).json({
          message: error.message,
        });
      }
      req.author = devededToken;
      

      const { is_expert, authorRoles } = devededToken;

      let hasRole = false;

      authorRoles.forEach((authorRole) => {
        if (roles.includes(authorRole)) {
          hasRole = true;
        }
      });
      if (!is_expert || !hasRole) {
        return res
          .status(401)
          .send({ message: "Sizga bunday huquq berilmagan " });
      }
      next();
    } catch (error) {
      console.log(error);
      return res
        .status(403)
        .send({ message: "Avtor ro'yhatdan o'tmagan (token notogri) " });
    }
  };
};
