const { body } = require("express-validator");


const loginValidation = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .matches(/^\S+$/)
      .withMessage("Username must not contain spaces")
      .isLength({ min: 5, max: 10 })
      .withMessage("Username must be 5 to 10 characters long"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6, max: 15 })
      .withMessage("Username must be 6 to 15 characters long"),
  ];
};

const userValidation = () => {
  return [
    body("fullname")
      .trim()
      .notEmpty()
      .withMessage("Fullname is required")
      .isLength({ min: 5, max: 20 })
      .withMessage("Fullname must be 5 to 20 characters long"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .matches(/^\S+$/)
      .withMessage("Username must not contain spaces")
      .isLength({ min: 5, max: 10 })
      .withMessage("Username must be 5 to 10 characters long"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6, max: 15 })
      .withMessage("Username must be 6 to 15 characters long"),

    body("role")
      .trim()
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["admin", "author"])
      .withMessage("Role must be admin or author"),
  ];
};

const userUpdateValidation = () => {
  return [
    body("fullname")
      .trim()
      .notEmpty()
      .withMessage("Fullname is required")
      .isLength({ min: 5, max: 20 })
      .withMessage("Fullname must be 5 to 20 characters long"),

    body("password")
      .optional({ checkFalsy: true })
      .isLength({ min: 6, max: 15 })
      .withMessage("Username must be 6 to 15 characters long"),

    body("role")
      .trim()
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["admin", "author"])
      .withMessage("Role must be admin or author"),
  ];
};

const categoryValidation = () => {
  return [
    body("categoryName")
      .trim()
      .notEmpty()
      .withMessage("Category name is required")
      .isLength({ min: 3, max: 30 })
      .withMessage("Category name must be 3 to 30 characters long"),

    body("description")
      .optional({ checkFalsy: true })
      .isLength({ min: 5, max: 100 })
      .withMessage("Description must be 10 to 100 characters long"),
  ];
};

const articleValidation = () => {
  return [
    body("newsTitle")
      .trim()
      .notEmpty()
      .withMessage("News title is required")
      .isLength({ min: 5, max: 100 })
      .withMessage("News title must be 5 to 100 characters long"),

    body("newsDescription") 
      .optional({ checkFalsy: true })
      .isLength({ min: 10, max: 1000 })
      .withMessage("News description must be 10 to 1000 characters long"),  

    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required"),

  ];  
};


module.exports = {
  loginValidation,
  userValidation,
  userUpdateValidation,
  categoryValidation,
  articleValidation,
};


