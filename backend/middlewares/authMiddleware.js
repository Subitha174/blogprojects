const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {

  try {

    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "User not found"
        });
      }

      return next(); 

    }

    return res.status(401).json({
      message: "No token, authorization denied"
    });

  } catch (error) {

    return res.status(401).json({
      message: "Not authorized, token failed"
    });

  }

};

const authorOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized"
    });
  }

  if (req.user.role !== "author") {
    return res.status(403).json({
      message: "Authors only"
    });
  }

  return next();

};


module.exports = {
  protect,
  authorOnly
};