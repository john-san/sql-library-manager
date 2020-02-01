var createError = require('http-errors');
const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route */
function asyncHandler(cb){
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (err) {
      next(err); // Handle general error
    }
  }
}

/* GET list of books */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({
    order: [["title", "ASC"]]
  });
  // uncomment below line and visit root to test general error handler
  // throw new Error(); 
  res.render("books/index", {  books , title: "Books" });
}));

/* GET form to create new book */
router.get('/new', (req, res) => {
  res.render("books/new-book", { book: {}, title: "New Book" });
});

/* POST create new book */
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new-book", {  book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }
  }
}));

/* GET form to edit book */
router.get("/:id/edit", asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/update-book", { book, title: "Update Book" }); 
  } else {
    return next(); // 404
  }
}));

/* GET view for individual book */
router.get("/:id", asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/show", { book, title: book.title }); 
  } else {
    return next(); // 404
  }
})); 

/* Update a book */
router.post('/:id/edit', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id); 
    } else {
      return next(); // 404
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/update-book", { book, errors: error.errors, title: "Update Book" });
    } else {
      throw error;
    }
  }
}));

/* GET view to delete book */
router.get("/:id/delete", asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/delete", { book, title: "Delete Book" });
  } else {
    return next(); // 404
  }
}));

/* Delete an book */
router.post('/:id/delete', asyncHandler(async (req ,res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    return next(); // 404
  }
}));

module.exports = router;