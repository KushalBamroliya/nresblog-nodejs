const newsModel = require("../models/News");
const userModel = require("../models/User");
const categoryModel = require("../models/Category");
const fs = require("fs");
const path = require("path");
const error = require("../utils/errorMsg");
const { validationResult } = require("express-validator");

exports.allArticle = async (req, res, next) => {
  try {
    let news;
    if (req.role === "admin") {
      news = await newsModel
        .find()
        .populate("category", "categoryName")
        .populate("author", "fullname");
      // res.json(news);
    } else {
      news = await newsModel
        .find({ author: req.id })
        .populate("category", "categoryName")
        .populate("author", "fullname");
      // res.json(news);
    }
    res.render("../views/admin/articles/", { role: req.role, news });
  } catch (err) {
    next(err);
  }
};
exports.addArticlePage = async (req, res) => {
  const category = await categoryModel.find();
  res.render("../views/admin/articles/create.ejs", {
    role: req.role,
    category,
    errors: [],
  });
};
exports.addArticle = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const category = await categoryModel.find();
    return res.status(400).render("../views/admin/articles/create.ejs", {
      category,
      role: req.role,
      errors: error.array(),
    });
  }
  try {
    const { newsTitle, newsDescription, category } = req.body;

    // ✅ Validate image
    if (!req.file) {
      const error = new Error("Image is required");
      error.status = 400;
      return next(error);
    }
    // ✅ Validate fields
    if (!newsTitle || !newsDescription || !category) {
      const error = new Error("All fields are required");
      error.status = 400;
      return next(error);
    }
    const news = new newsModel({
      newsTitle,
      newsDescription,
      category,
      author: req.id, // ✅ FIXED
      newsImage: req.file.filename, // ✅ store filename only
    });
    await news.save(); // ✅ FIXED
    return res.redirect("/admin/article");
  } catch (error) {
    next(error);
  }
};

exports.updateArticlePage = async (req, res, next) => {
  const id = req.params.id;
  if (!id || id.length < 24) {
    return res.status(400).send({ message: "Invalid article id" });
  }
  try {
    const article = await newsModel
      .findById(id)
      .populate("category", "categoryName")
      .populate("author", "fullname");
    if (!article) {
      return next(error("Article not found", 404));
    }

    if (req.role === "author") {
      if (article.author._id.toString() !== req.id.toString()) {
        return res.status(401).send({ message: "Unauthorized" });
      }
    }

    const category = await categoryModel.find();
    res.render("../views/admin/articles/update.ejs", {
      role: req.role,
      article,
      category,
      errors: [],
    });
  } catch (error) {
    console.error("Update Article Error:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};
exports.updateArticle = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const category = await categoryModel.find();
    return res.status(400).render("../views/admin/articles/update.ejs", {
      role: req.role,
      errors: error.array(),
      article: req.body,
      category,
    });
  }
  const id = req.params.id;
  const { newsTitle, newsDescription, category } = req.body;
  try {
    const article = await newsModel.findById(id);
    if (!article) {
      return next(error("Article not found", 404));
    }
    if (req.role === "author") {
      if (article.author._id.toString() !== req.id.toString()) {
        return res.status(401).send({ message: "Unauthorized" });
      }
    }
    article.newsTitle = newsTitle || article.newsTitle;
    article.newsDescription = newsDescription || article.newsDescription;
    article.category = category || article.category;

    if (req.file) {
      const imagePath = path.join(
        __dirname,
        "../public/uploads",
        article.newsImage
      );
      fs.unlinkSync(imagePath);
      article.newsImage = req.file.filename;
    }

    await article.save();
    return res.redirect("/admin/article");
  } catch (error) {
    next(error);
  }
};
exports.deleteArticle = async (req, res, next) => {
  const id = req.params.id;
  if (!id || id.length < 24) {
    return next(error("Article Id not found", 404));
  }
  try {
    const article = await newsModel.findById(id);
    if (!article) {
      return next(error("Article not found", 404));
    }
    if (req.role === "author") {
      if (article.author._id.toString() !== req.id.toString()) {
        return res.status(401).send({ message: "Unauthorized" });
      }
    }
    try {
      const imagePath = path.join(
        __dirname,
        "../public/uploads",
        article.newsImage
      );
      fs.unlinkSync(imagePath);
    } catch (error) {
      next(error);
    }

    await article.deleteOne();

    return res.redirect("/admin/article");
  } catch (error) {
    next(error);
  }
};
