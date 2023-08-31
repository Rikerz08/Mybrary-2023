const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const path = require("path");
const fs = require("fs");
const Book = require("../models/book");
// multer is a library for handling multi-part forms (such as cover image as a file)
const multer = require("multer");
// public is included cuz thats where we store our images before sending them to body
const uploadPath = path.join("public", Book.coverImageBasePath);
// array of file types
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

// all books
router.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != "") {
    // query.regex is just like appending to the query variable defined as Book.find()
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    // instead of query.regex, we go with "lte" which means less than or equal to
    query = query.lte("publishDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    // instead of query.regex, we go with "lte" which means less than or equal to
    query = query.gte("publishDate", req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render("books/index", {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// new book(just the forms page to create)
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// create book (actually creating and saving author to db)
// telling multer that we are uploading a single file with the handle name "cover"
router.post("/new", upload.single("cover"), async (req, res) => {
  // get the filename from the file if it exists
  // if not, just leave it null
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    // need to wrap it around new date object cuz the body returns a string
    // and we need it to be in date format
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description,
  });
  console.log("fileName: " + fileName);
  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect("/books");
  } catch {
    // remove book that is created if there is error creating book
    // this is because progarm automatically puts book cover in our
    // public folder even if there was an error creating book
    if (book.coverImageName != null) {
      removeBookCover(book.coverImageName);
    }
    renderNewPage(res, book, true);
  }
});

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.err(err);
  });
}

// middleware for "/new" route since we are to render it sa post request catch clause
async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) {
      params.errorMessage = "Error Creating Book";
    }

    res.render("books/new", params);
  } catch {
    res.redirect("/books");
  }
}

module.exports = router;
