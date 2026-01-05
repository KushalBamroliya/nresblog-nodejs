const userModel = require("../models/User");
const newsModel = require("../models/News");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { validationResult } = require("express-validator");

dotenv.config();

// Login Page
exports.loginPage = async (req, res) => {
  res.render("../views/admin/login.ejs", {
    layout: false,
    errors: [],
  });
};

exports.adminLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("../views/admin/login.ejs", {
      layout: false,
      errors: errors.array(),
    });
  }

  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(401).send("Username or password is incorrect");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Username or password is incorrect");
    }
    const token = jwt.sign(
      {
        id: user._id,
        fullname: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    res.redirect("/admin/dashboard");
  } catch (error) {
    next(err);
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin/");
};

// User CRUD Controllers
exports.allUser = async (req, res) => {
  const users = await userModel.find();
  res.render("../views/admin/users/index.ejs", { users, role: req.role, query: req.query });
};

exports.addUserPage = async (req, res) => {
  res.render("../views/admin/users/create.ejs", { role: req.role, errors: [] });
};

exports.addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("../views/admin/users/create.ejs", {
      role: req.role,
      errors: errors.array(),
    });
  }
  await userModel.create(req.body);

  res.redirect("/admin/users");
};

exports.updateUserPage = async (req, res, next) => {
  // await userModel.findByIdAndUpdate(req.params.id, req.body);
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("../views/admin/users/update.ejs", {
      user,
      role: req.role,
      errors: [],
    });
  } catch (error) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("../views/admin/users/update.ejs", {
      user: req.body,
      role: req.role,
      errors: errors.array(),
    });
  }
  const id = req.params.id;
  const { fullname, password, role } = req.body;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.fullname = fullname || user.fullname;
    if (password) {
      user.password = password;
    }
    user.role = role || user.role;
    await user.save();
    res.redirect("/admin/users");
  } catch (error) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const article = await newsModel.findOne({ author: id });
    if (article) {
      return res
        .status(400)
        .redirect(
          "/admin/users?error=User is used in articles and cannot be deleted"
        );
    }
    await user.deleteOne();
    res.redirect("/admin/users?success=User deleted successfully");
  } catch (error) {
    next(error);
  }
};
