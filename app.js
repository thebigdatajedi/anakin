const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://cruzfg:Butthead1@anakin.2wbl4uu.mongodb.net/bookApi');

//first create the router
const bookRouter = express.Router();
const port = process.env.PORT || 3000;

//create the book model
const Book = require('./models/bookModel');
//books = Book.db.collection('books');

//pulling data from MongoDB with Express
bookRouter.route('/books')
    .get((req, res) => {
        Book.find((err, books) => {
            if (err) {
                return res.send(err);
            }
            return res.json(books);
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
