const mongoose = require("mongoose");

const categoryModel = require("../models/Category");
const commentModel = require("../models/Comment");
const newsModel = require("../models/News");
const userModel = require("../models/User");
const settingModel = require("../models/Setting");
const createError = require("../utils/errorMsg");
exports.index = async (req, res) => {
  const news = await newsModel
    .find()
    .sort({ createdAt: "desc" })
    .populate("category", { categoryName: 1, slug: 1 })
    .populate("author", "fullname");

  const letestNews = await newsModel
    .find()
    .sort({ createdAt: "desc" })
    .limit(3)
    .populate("category", { categoryName: 1, slug: 1 })
    .populate("author", "fullname");

  const setting = await settingModel.findOne();
  const categoryInuse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInuse } });
  // res.json({news, categories, letestNews, setting})
  res.render("index", {
    role: req.role,
    news,
    categories,
    letestNews,
    setting,
    query: req.query,
  });
};

exports.articlesByCategory = async (req, res, next) => {
  const category = await categoryModel.findOne({ slug: req.params.slug });

  if (!category) return next(createError("Category not found", 404));

  const news = await newsModel
    .find({ category: category._id })
    .sort({ createdAt: "desc" })
    .populate("category", { categoryName: 1, slug: 1 })
    .populate("author", "fullname");
  // res.json(news);
  const categoryInuse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInuse } });

  const letestNews = await newsModel
    .find()
    .sort({ createdAt: "desc" })
    .limit(3)
    .populate("category", { categoryName: 1, slug: 1 })
    .populate("author", "fullname");

  const setting = await settingModel.findOne();

  res.render("category", {
    role: req.role,
    news,
    categories,
    category,
    letestNews,
    setting,
  });
};

exports.singleArticle = async (req, res,next) => {
  const news = await newsModel
    .findById(req.params.id)
    .sort({ createdAt: "desc" })
    .populate("category", { categoryName: 1, slug: 1 })
    .populate("author", "fullname");
  // res.json(news);
  if(!news) return next(createError("Article not found", 500));
  const categoryInuse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInuse } });
 if(!categories) return next(createError("Article not found", 500));
  const letestNews = await newsModel
    .find()
    .sort({ createdAt: "desc" })
    .limit(3)
    .populate("category", { categoryName: 1, slug: 1 })
    .populate("author", "fullname");

  const setting = await settingModel.findOne();

  // get all comments for this article
  const comments = await commentModel.find({status: "approved", article: req.params.id});
  if(!comments) return next(createError("Article not found", 404));
  res.render("single", {
    role: req.role,
    news,
    categories,
    setting,
    letestNews,
    comments
  });
};

exports.search = async (req, res) => {
  const searchQ = req.query.search;
  const news = await newsModel
    .find({
      $or: [
        { newsTitle: { $regex: searchQ, $options: "i" } },
        { newsDescription: { $regex: searchQ, $options: "i" } },
      ],
    })
    .sort({ createdAt: "desc" })
    .populate("category", { categoryName: 1, slug: 1 })
    .populate("author", "fullname");
  // res.json(news);
  const categoryInuse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInuse } });

  const letestNews = await newsModel
    .find()
    .sort({ createdAt: "desc" })
    .limit(3)
    .populate("category", { categoryName: 1, slug: 1 })
    .populate("author", "fullname");

  const setting = await settingModel.findOne();

  res.render("search", { news, categories, searchQ, letestNews, setting });
};

exports.author = async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.params.id });
  if(!user) return next(createError("User not found", 404));
  const news = await newsModel
    .find({ author: req.params.id })
    .sort({ createdAt: "desc" })
    .populate("category", { categoryName: 1, slug: 1 })
    .populate("author", "fullname");
  // res.json(news);
  const categoryInuse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInuse } });
  if(!categories) return next(createError("category not found", 404));
  const letestNews = await newsModel
    .find()
    .sort({ createdAt: "desc" })
    .limit(3)
    .populate("category", { categoryName: 1, slug: 1 })
    .populate("author", "fullname");

  const setting = await settingModel.findOne();

  res.render("author", {
    role: req.role,
    news,
    categories,
    user,
    letestNews,
    setting,
  });
};

exports.addComments = async (req, res,next) => {
  try {
    const comment = new commentModel({
      name: req.body.name,
      email: req.body.email,
      content: req.body.content,
      article: req.params.id,
    });
    await comment.save();
    res.redirect(`/single/${req.params.id}`);
  } catch (error) {
    return next(createError(error.message, 500));
  }
};
