const { badRequest } = require("../error/apierror");
const { to } = require("../helpers/to_promise");
const myJwt = require("../services/jwt_service");

module.exports = async function (req, res, next) {
   
  //  throw badRequest("Xatolik");
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res
        .status(403)
        .json({ message: "Avto ro'yhatdan o'tganmagan (null authorizations)" });
    }
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    //  console.log("token : ", token);
    // console.log(bearer);

    if (bearer != "Bearer" || !token) {
      return res
        .status(403)
        .json({ message: "Avtor ro'yhatdan o'tmagan (token berilmagan)" });
    }

    //   const devededToken = jwt.verify(token, config.get("tokenKey"));
    const [error, devededToken] = await to(myJwt.verifyAccessToken(token));
    // console.log(
    //   "myJwt.verifyAccessToken(token)",
    //   myJwt.verifyAccessToken(token)
    // );

    if (error) {
      return res.status(403).json({
        message: error.message,
      });
    }

    console.log("devededToken: ", devededToken);
    req.author = devededToken;
    console.log("req.author", req.author);

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .send({ message: "Avtor ro'yhatdan o'tmagan (token notogri) " });
  }
};
