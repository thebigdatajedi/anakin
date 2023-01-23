const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
mongoose.connect('mongodb+srv://cruzfg:Butthead1@anakin.2wbl4uu.mongodb.net/bookApi');
const port = process.env.PORT || 3000;

const book = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(book);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', bookRouter);

app.get('/', (req, res) => {
    res.send('Welcome the bookd API!');
});

//listen configuration
app.listen(port, () => {
    console.log(`Running on PORT: ${port}`);
});
