const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
mongoose.connect('mongodb+srv://cruzfg:Butthead1@anakin.2wbl4uu.mongodb.net/bookApi');

//first create the router
const bookRouter = express.Router();
const port = process.env.PORT || 3000;

//create the book model
const Book = require('./models/bookModel');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
    });


//then wire up the router (use the router)
app.use('/api', bookRouter);

app.get('/', (req, res) => {
    res.send('Welcome the bookd API!');
});

//listen configuration
app.listen(port, () => {
    console.log(`Running on PORT: ${port}`);
});
