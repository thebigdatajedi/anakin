const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://cruzfg:Butthead1@anakin.2wbl4uu.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});
//first create the router
const bookRouter = express.Router();
const port = process.env.PORT || 3000;
//create the book model
const Book = require('./models/bookModel');

//then configure the router
bookRouter.route('/Books')
    .get((req, res) => {
        Book.find((err, books) => {
            if (err) {
                return res.send(err);
            }
            return res.json(books);
        });
//then wire up the router (use the router)
        app.use('/api', bookRouter);

        app.get('/', (req, res) => {
            res.send('Welcome to my Nodemon API!, Im running on port 4000 - more');
        });
        app.listen(port, () => {
            console.log(`Running on PORT: ${port}`);
        });
    });