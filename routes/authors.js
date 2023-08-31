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
  // The primary purpose of providing author: new Author() in this context would be to maintain consistency in the form rendering across different routes.
  // If you have other routes that handle editing or updating authors, those routes might use a similar form template as the "new author" form.
  // In such cases, passing an instance of Author to the view can help keep the codebase consistent and reduce potential code duplication.
  // If you don't foresee using the same form template for other routes or if the "new author" form has unique requirements, you can omit the author: new Author() part from the /new GET route without any adverse effects.
  // The form will render empty, and users will still be able to fill in the details manually.
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
