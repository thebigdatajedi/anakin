const express = require('express');

const app = express();
//first create the router
const bookRouter = express.Router();
const port = process.env.PORT || 3000;

//then configure the router
bookRouter.route('/Books')
    .get((req, res) => {
        const response = { hello: 'This is my API' };
        res.json(response);
    });
//then wire up the router (use the router)
app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my Nodemon API!, Im running on port 4000 - more');
});
app.listen(port, () => {
  console.log(`Running on PORT: ${port}`);
});
