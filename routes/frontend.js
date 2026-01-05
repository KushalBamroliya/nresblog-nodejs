const express = require("express");
const router = express.Router();

const {
    index,
    articlesByCategory,
    singleArticle,
    search,
    author,
    addComments,
} = require("../controllers/siteController");


const loadCommondata = require("../middleware/loadCommonData");
const { isLogin } = require("../middleware/isLogin");
router.use(loadCommondata); // don't use it here

router.get("/", index);
router.get("/category/:slug", articlesByCategory);
router.get("/single/:id", singleArticle);
router.get("/search", search);
router.get("/author/:id", author);
router.post("/single/:id/comment", addComments);


router.use((req, res, next) => {
  res
    .status(404)
    .render("../views/404.ejs", {
      message: "404 Page Not Found",
    });
});

router.use((err,req,res,next)=>{
    const status = err.status || 500;
    res.status(status).render("../views/errors.ejs",{
        message: err.message || "Something went wrong",
        status
    })
})
module.exports = router;
