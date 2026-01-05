const express = require("express");
const router = express.Router();
const { isLogin } = require("../middleware/isLogin");
const { isAdmin } = require("../middleware/isAdmin");
const fs = require("fs");
const path = require("path");
const ArticleModel = require("../models/News");
const UserModel = require("../models/User");
const CategoryModel = require("../models/Category");
const settiongModel = require("../models/Setting");
const {
  loginPage,
  adminLogin,
  logout,
  allUser,
  addUserPage,
  addUser,
  updateUserPage,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const {
  allCategory,
  addCategoryPage,
  addCategory,
  updateCategoryPage,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  allArticle,
  addArticlePage,
  addArticle,
  updateArticlePage,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const {allComments, deleteComments, updateCommentsStatus, getComment} = require('../controllers/commentsController')
const upload = require("../middleware/multer");
const isValid = require("../middleware/validation");

// const { allComments } = require("../controllers/commentController");

//Login Page
router.get("/", loginPage);
router.post("/index", isValid.loginValidation(), adminLogin);
router.get("/logout", isLogin, logout);

//User CRUD Routes
router.get("/users", isLogin, isAdmin, allUser);
router.get("/add-user", isLogin, isAdmin, addUserPage);
router.post("/add-user", isLogin, isAdmin, isValid.userValidation(), addUser);
router.get("/update-user/:id", isLogin, isAdmin, updateUserPage);
router.post(
  "/update-user/:id",
  isLogin,
  isAdmin,
  isValid.userUpdateValidation(),
  updateUser
);
router.get("/delete-user/:id", isLogin, isAdmin, deleteUser);

//Category CRUD Routes
router.get("/category", isLogin, isAdmin, allCategory);
router.get("/add-category", isLogin, isAdmin, addCategoryPage);
router.post(
  "/add-category",
  isLogin,
  isAdmin,
  isValid.categoryValidation(),
  addCategory
);
router.get("/update-category/:id", isLogin, isAdmin, updateCategoryPage);
router.post(
  "/update-category/:id",
  isLogin,
  isAdmin,
  isValid.categoryValidation(),
  updateCategory
);
router.get("/delete-category/:id", isLogin, isAdmin, deleteCategory);

//Article CRUD Routes
router.get("/article", isLogin, allArticle);
router.get("/add-article", isLogin, addArticlePage);
router.post(
  "/add-article",
  isLogin,
  upload.single("newsImage"),
  isValid.articleValidation(),
  addArticle
);
router.get("/update-article/:id", isLogin, updateArticlePage);
router.post(
  "/update-article/:id",
  isLogin,
  upload.single("newsImage"),
  isValid.articleValidation(),
  updateArticle
);
router.get("/delete-article/:id", isLogin, deleteArticle);

//Comment Routes
router.get("/comments", isLogin, allComments);
router.put("/update-comment-status/:id", isLogin, updateCommentsStatus);
router.get("/delete-comment/:id", isLogin, deleteComments);
router.get("/get-comment/:id", isLogin, getComment);
//Dashboard Routes
router.get("/dashboard", isLogin, async (req, res, next) => {
  try {
    let articleCount;
    if (req.role === "admin") {
      articleCount = await ArticleModel.countDocuments();
    } else {
      articleCount = await ArticleModel.countDocuments({ author: req.id });
    }
    await ArticleModel.countDocuments();
    const categoryCount = await CategoryModel.countDocuments();
    const userCount = await UserModel.countDocuments();

    res.render("admin/dashboard", {
      role: req.role,
      fullname: req.fullname,
      articleCount,
      categoryCount,
      userCount,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/settings", isLogin, isAdmin, async (req, res, next) => {
  try {
    const setting = await settiongModel.findOne();
    res.render("../views/admin/setting.ejs", { role: req.role, setting });
  } catch (err) {
    next(err);
  }
});
router.post(
  "/settings",
  isLogin,
  isAdmin,
  upload.single("websiteLogo"),
  async (req, res, next) => {
    try {
      const { websiteTitle, footerDesctioption } = req.body;

      let settingDoc = await settiongModel.findOne();
      if (!settingDoc) {
        settingDoc = new settiongModel();
      }
      const oldLogo = settingDoc.websiteLogo;

      settingDoc.websiteTitle = websiteTitle;
      settingDoc.footerDesctioption = footerDesctioption;

      if (req.file) {
        settingDoc.websiteLogo = req.file.filename;
      }

      await settingDoc.save();

      if (req.file && oldLogo) {
        const oldImagePath = path.join(
          __dirname,
          `../public/uploads/${oldLogo}`
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      return res.redirect("/admin/settings");
    } catch (error) {
      next(error);
    }
  }
);

//404 Middleware
router.use(isLogin, (req, res, next) => {
  res
    .status(404)
    .render("../views/admin/404.ejs", {
      role: req.role,
      message: "404 Page Not Found",
    });
});
//500 Middleware
// router.use(isLogin, (err, req, res, next) => {
//   res.status(500).render("../views/admin/500.ejs", { role: req.role, message: req.err || "Internal Server Error" });
// });

router.use(isLogin, (err, req, res, next) => {
  const status = err.status || 500;
  const view =
    status === 404 ? "../views/admin/404.ejs" : "../views/admin/500.ejs";
  res
    .status(status)
    .render(view, {
      role: req.role,
      message: err.message || "Something went wrong",
    });
});

module.exports = router;
