const categoryModel = require("../models/Category");
const commentModel = require("../models/Comment");
const newsModel = require("../models/News");
const settingModel = require("../models/Setting");

const loadCommondata = async (req, res, next) => {
  try {
    const letestNews = await newsModel
      .find()
      .sort({ createdAt: "desc" })
      .limit(3)
      .populate("category", { categoryName: 1, slug: 1 })
      .populate("author", "fullname");

    const setting = await settingModel.findOne();
    const categoryInuse = await newsModel.distinct("category");
    const categories = await categoryModel.find({
      _id: { $in: categoryInuse },
    });
    res.locals.letestNews = letestNews;
    res.locals.categories = categories;
    res.locals.setting = setting;
    next();
  } catch (error) {
    next(error)
  }
};

module.exports = loadCommondata;