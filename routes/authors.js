const express = require("express");
const router = express.Router();
const Author = require("../models/author");

// all authors
router.get("/", async (req, res) => {
  // variable for our search objects
  let searchOptions = {};
  // req.query is used since get reqs have their parameter in the URL
  // req.body if POST
  // req.query.name is the placeholder of name input field
  if (req.query.name != null && req.query.name !== "") {
    // regular expression is like sWhereILike - not rlly exact word to
    // provide output of search
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const allAuthors = await Author.find(searchOptions);
    res.render("authors/index", {
      allAuthors: allAuthors,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// new authors (just the forms page to create)
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// create author (actually creating and saving author to db)
router.post("/new", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });

  try {
    const newAuthor = await author.save();
    // res.redirect(`authors/${newAuthor.id}`);
    // res.status(201).send(author.name);
    res.redirect("/authors");
  } catch {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating Author",
    });
  }
});

module.exports = router;
