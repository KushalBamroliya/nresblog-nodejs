const mongoose = require("mongoose");
const slugify = require("slugify");


const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    description: {
      type: String,
      trim: true
    },
    slug: {
      type: String,
      lowercase: true
    },
    timestamps: {
      type: Date,
      default: Date.now
    }
  },
);

categorySchema.pre('save',async function() {
  this.slug = await slugify(this.categoryName, { lower: true });
});

module.exports = mongoose.model("Category", categorySchema);
