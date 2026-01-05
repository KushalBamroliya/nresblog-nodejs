const commentModel = require("../models/Comment");
const newsModel = require("../models/News");

const allComments = async (req, res) => {
  let comments;
  if (req.role === "admin") {
    comments = await commentModel
      .find()
      .populate("article", "newsTitle")
      .sort({ createdAt: "desc" });
  } else {
    const news = await newsModel.find({ author: req.id });
    const newsId = news.map((n) => n._id);
    comments = await commentModel
      .find({ article: { $in: newsId } })
      .populate("article", "newsTitle")
      .sort({ createdAt: "desc" });
  }
  //// res.json({role: req.role, comments});
  res.render("../views/admin/comments/index.ejs", { role: req.role, comments });
};

const updateCommentsStatus = async (req, res) => {
  try {
    const { status } = req.body;

    await commentModel.findByIdAndUpdate(req.params.id, { status });

    // ✅ ONLY JSON RESPONSE
    res.json({
      success: true,
      message: "Status updated",
    });
  } catch (error) {
    console.error("Update Comment Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteComments = async (req, res) => {};
const getComment = async (req, res) => {
  try {
    const comment = await commentModel
      .findById(req.params.id)
      .populate("article", "newsTitle");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(comment);
  } catch (error) {
    console.error("Get Comment Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  allComments,
  updateCommentsStatus,
  deleteComments,
  getComment,
};
