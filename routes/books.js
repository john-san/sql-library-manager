const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (err) {
      next(err); // Handle general error
    }
  }
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("books/index", {  books , title: "Books" });
}));

/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("books/new-book", { book: {}, title: "New Book" });
});

/* POST create book. */
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

/* Edit book form. */
router.get("/:id/edit", asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/update-book", { book, title: "Edit Book" }); 
  } else {
    return next(); // 404
  }
  
}));

/* GET individual book. */
router.get("/:id", asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/show", { book, title: book.title }); 
  } else {
    return next(); // 404
  }
  
})); 

/* Update a book. */
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
      res.render("books/update-book", { book, errors: error.errors, title: "Edit Book" });
    } else {
      throw error;
    }
  }
  
  
}));

/* Delete book form. */
router.get("/:id/delete", asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/delete", { book, title: "Delete Book" });
  } else {
    return next(); // 404
  }
  
}));

/* Delete individual book. */
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