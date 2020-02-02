const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const sequelize = require('../models').sequelize;

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

/* provide search functionality */
async function generalSearch(query) {
  const year = parseInt(query);

  // if query is not a number, run search to match title, author, or genre. 
  // otherwise, run search to match exact year.
  if (isNaN(year)) {
    return await Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${query}%`
            }
          },
          {
            author: {
              [Op.like]: `%${query}%`
            }
          },
          {
            genre: {
              [Op.like]: `%${query}%`
            }
          }
        ]
      },
      order: [["title", "ASC"]]
    });
  } else {
    return await Book.findAll({
      where: {
        year: {
          [Op.eq]: year
        }
      },
      order: [["title", "ASC"]]
    });
  }
}

function getPageParams(req) {
  const pageParams = {
    limit: 5,
    page: 1, // for UI
    queryPage: 0 // for queries
  };

  if (req.query.page) {
    pageParams.page = parseInt(req.query.page);
    pageParams.queryPage = pageParams.page - 1;
  } 

  return pageParams;
}

/* GET list of books */
router.get('/', asyncHandler(async (req, res) => {
  const pageParams = getPageParams(req);
  
  // destructure books & count from findAndCountAll
  // https://stackoverflow.com/questions/47546824/sequelize-configuration-to-retrieve-total-count-with-details , Yuriy Rykpa
  const { rows: books, count }= await Book.findAndCountAll({
    order: [["title", "ASC"]],
    limit: pageParams.limit,
    offset: pageParams.limit * pageParams.queryPage
  });
  
  pageParams.numberOfPages = Math.ceil(count / pageParams.limit);

  res.render("books/index", {  books , pageParams, title: "Books" });
}));

/* GET, search for books */
router.get('/search', asyncHandler(async (req, res) => {
  const books = await generalSearch(req.query.q);
  
  res.render("books/search", {  books , title: "Search" });
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