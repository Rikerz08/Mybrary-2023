const mongoose = require("mongoose");

const path = require("path");
// path where cover images will be stored
const coverImageBasePath = "uploads/bookCovers";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  publishDate: {
    type: Date,
    required: true,
  },

  pageCount: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },

  // we did the coverImageName instead of path or file cuz we gon use multer and path libraries for it
  coverImageName: {
    type: String,
    required: true,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

// virtual variable is the same as the variables above HOWEVER
// it will derive its values from the defined variables above
// in this case "coverImageBasePath"
bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImageName != null) {
    return path.join("/", coverImageBasePath, this.coverImageName);
  }
});

module.exports = mongoose.model("Books", bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;
