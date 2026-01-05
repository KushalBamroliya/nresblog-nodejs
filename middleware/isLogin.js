const jwt = require("jsonwebtoken");

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/admin/");
    }
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    req.fullname = tokenData.fullname;
    req.id = tokenData.id;
    req.role = tokenData.role;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};

module.exports = { isLogin };
