const express = require('express');

function routes(Book) {
    const bookRouter = express.Router();
    //pulling multi book data from MongoDB with Express
    bookRouter.route('/books')
        .post((req, res) => {
            const book = new Book(req.body);
            console.log(book);
            book.save();
            return res.status(201).json(book);
        })
        .get((req, res) => {
            //fixing query to weed out junk data
            let query = {};

            //if the query is junk then return all books
            if (req.query.genre) {
                query.genre = req.query.genre;
            } else if (req.query.author) {
                query.author = req.query.author;
            } else if (req.query.title) {
                query.title = req.query.title;
            } else if (req.query.read) {
                query.read = req.query.read;
            } else {
                query = {};
            }
            //querying the database
            Book.find(query, (err, books) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(books);
            });
        });
    //pulling single book data from MongoDB with Express
    bookRouter.route('/books/:bookId')
        .get((req, res) => {
            //fixing query to weed out junk data

            //querying the database
            Book.findById(req.params.bookId, (err, book) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(book);
            });
        })
        .put((req, res) => {
            Book.findById(req.params.bookId, (err, book) => {
                if (err) {
                    return res.send(err);
                }
                book.title = req.body.title;
                book.author = req.body.author;
                book.genre = req.body.genre;
                book.read = req.body.read;
                book.save();
                return res.json(book);
        });

    return bookRouter;
    });
}

module.exports = routes;