const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/", async (req, res) => {
  let books = [];
  try {
    // 'desc' is descending, limit means first 10 books
    books = await Book.find().sort({ createdAt: "desc" }).limit(10).exec();
    res.render("index", { books: books });
  } catch {
    books = [];
  }
});

module.exports = router;
