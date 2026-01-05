const { validationResult } = require("express-validator");
const categoryModel = require("../models/Category");
const newsModel = require("../models/News");

const express = require("express");
const router = express.Router();

exports.allCategory = async (req, res) => {
  const category = await categoryModel.find();
  res.render("../views/admin/categories/", { role: req.role, category, query: req.query });
};
exports.addCategoryPage = async (req, res) => {
  res.render("../views/admin/categories/create.ejs", {
    role: req.role,
    errors: [],
  });
};
exports.addCategory = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).render("../views/admin/categories/create.ejs", {
      role: req.role,
      errors: error.array(),
    });
  }
  const { categoryName, description } = req.body;
  try {
    await categoryModel.create({ categoryName, description });
    res.status(201).redirect("/admin/category");
  } catch (error) {
    next(err);
  }
};
exports.updateCategoryPage = async (req, res, next) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.render("../views/admin/categories/update.ejs", {
      role: req.role,
      category,
      errors: [],
    });
  } catch (error) {
    next(err);
  }
};
exports.updateCategory = async (req, res, next) => {
  const id = req.params.id;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const category = await categoryModel.findById(req.params.id);
    return res.status(400).render("../views/admin/categories/update.ejs", {
      category,
      role: req.role,
      errors: error.array(),
    });
  }

  const { categoryName, description } = req.body;
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    category.categoryName = categoryName || category.categoryName;
    category.description = description || category.description;
    await category.save();
    res.redirect("/admin/category");
  } catch (error) {
    next(err);
  }
};
exports.deleteCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send("Category not found");
    }

    const article = await newsModel.findOne({ category: id });
    if (article) {
      return res.status(400).redirect("/admin/category?error=Category is used in articles and cannot be deleted");
    }

    await category.deleteOne();
    res.redirect("/admin/category?success=Category deleted successfully");
  } catch (error) {
    next(error);
  }
};
