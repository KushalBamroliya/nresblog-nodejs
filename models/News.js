const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");


const newsSchema = new mongoose.Schema(
  {
    newsTitle: {
      type: String,
      required: true,
      trim: true
    },
    newsDescription: {
      type: String,
      required: true
    },
    newsImage: {
      type: String   // image URL or filename
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

newsSchema.plugin(mongoosePaginate);


module.exports = mongoose.model("News", newsSchema);
