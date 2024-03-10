const { to } = require("../helpers/to_promise");
const myJwt = require("../services/jwt_service");
module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res
        .status(403)
        .json({ message: "user ro'yhatdan o'tganmagan (null authorizations)" });
    }
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    

    if (bearer != "Bearer" || !token) {
      return res
        .status(403)
        .json({ message: "User ro'yhatdan o'tmagan (token berilmagan)" });
    }

  
    const [error, devededToken] = await to(myJwt.verifyAccessToken(token));
 

    if (error) {
      return res.status(403).json({
        message: error.message,
      });
    }

    console.log("devededToken: ", devededToken);
    req.user = devededToken;
   

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .send({ message: "User ro'yhatdan o'tmagan (token notogri) " });
  }
};
