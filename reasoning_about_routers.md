# How to reason about your router creation for an Express.js API.

This is the check list for CRUD when building an Express app.

For purpose of creating this list, we are going to call the thing that we are going to do CRUD operations on, Thing.  So the book, the appointment, whatever your system is going to create, read, update or delete is going to be Thing.  Our app will create, read, update and delete Things. (Note:: technically Thing would be part of the model in MVC or a more generic name for it would be a domain class or domain object) Still for our purpose we can just think of Thing as what we operate on for CRUD operations here is the check list for building an API that will CRUD Thing.

This doesn't include all the app code that it usually takes to support the router.

See the bottom of this page for an app.js & thingModel.js that support thingRouter.js

- [ ] Create an Express route for Thing
   - [ ] Import express
   - [ ] grab a router inside your router function.
```javascript
const express = require('express');

function routes(Thing) {
    const bookRouter = express.Router();
}
```

   - [ ] Create a router for Things, to get many things.
   - [ ] This router goes below the the router declaration above
   - [ ] The CRUD operations you need on many things and where they go is::
      - [ ] Create (POST) True
      - [ ] Read (GET) True
      - [ ] Update (PUT) Only if you are going to implement a mass editing feature.
      - [ ] Update (PATCH) Only if you are going to implement a mass editing feature and want to send only the changes to the record (faster than PUT because the payload is smaller, used in financial apps).
      - [ ] Delete (DELETE) Only if you implement a mass delete that deletes all the records.
```javascript
//pulling multi thing data from MongoDB with Express
	thingRouter.route('/things')
        .post((req, res) => {
            const thing = new Thing(req.body);
            console.log(thing);
            thing.save();
            return res.status(201).json(thing);
        })
        .get((req, res) => {
            //fixing query to weed out junk data
            let query = {};

            //if the query is junk then return all things
            if (req.query.thingger) {
                query.thingger = req.query.thingger;
            } else if (req.query.author) {
                query.thinggy = req.query.thinggy;
            } else if (req.query.title) {
                query.name = req.query.name;
            } else if (req.query.read) {
                query.used = req.query.used;
            } else {
                query = {};
            }
            //querying the database
            Thing.find(query, (err, things) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(things);
            });
        });
```

   - [ ] The CRUD operations you need on a single thing and where they go::
      - [ ] Create (POST) False, because you don't have an ID yet to created
      - [ ] Read (GET) True
      - [ ] Update (PUT) True
      - [ ] Update (PATCH) to send only the changes to the record (faster than PUT because the payload is smaller, used in financial apps).
      - [ ] Delete (DELETE) True
```javascript
thingRouter.route('/things/:thingId')
        .get((req, res) => {
            //fixing query to weed out junk data

            //querying the database
            Thing.findById(req.params.thingId, (err, thing) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(thing);
            });
        })
        .put((req, res) => {
            Thing.findById(req.params.thingId, (err, thing) => {
                if (err) {
                    return res.send(err);
                }
                thing.thingger = req.body.thingger;
                thing.thinggy = req.body.thingy;
                thing.name = req.body.name;
                thing.used = req.body.used;
                thing.save();
                return res.json(book);
        });

    return thingRouter;
    });
```

      - [ ] Here is the code all together.
```javascript
const express = require('express');

function routes(Thing) {
    const bookRouter = express.Router();

	   //pulling multi thing data from MongoDB with Express
	thingRouter.route('/things')
        .post((req, res) => {
            const thing = new Thing(req.body);
            console.log(thing);
            thing.save();
            return res.status(201).json(thing);
        })
        .get((req, res) => {
            //fixing query to weed out junk data
            let query = {};

            //if the query is junk then return all things
            if (req.query.thingger) {
                query.thingger = req.query.thingger;
            } else if (req.query.author) {
                query.thinggy = req.query.thinggy;
            } else if (req.query.title) {
                query.name = req.query.name;
            } else if (req.query.read) {
                query.used = req.query.used;
            } else {
                query = {};
            }
            //querying the database
            Thing.find(query, (err, things) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(things);
            });
        });
	
	thingRouter.route('/things/:thingId')
        .get((req, res) => {
            //fixing query to weed out junk data

            //querying the database
            Thing.findById(req.params.thingId, (err, thing) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(thing);
            });
        })
        .put((req, res) => {
            Thing.findById(req.params.thingId, (err, thing) => {
                if (err) {
                    return res.send(err);
                }
                thing.thingger = req.body.thingger;
                thing.thinggy = req.body.thingy;
                thing.name = req.body.name;
                thing.used = req.body.used;
                thing.save();
                return res.json(book);
        });

    return thingRouter;
    });
		
}
```

      - [ ] app.js::
```javascript
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
//MongoDb Atlas connection string.
mongoose.connect('mongodb+srv://<user_name>:<password>@<cluter_name>.<unique_identifier>.mongodb.net/thingApi');
const port = process.env.PORT || 3000;

const book = require('./models/thingModel');
const bookRouter = require('./routes/thingRouter')(thing);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', thingRouter);

app.get('/', (req, res) => {
    res.send('Welcome the think API!');
});

//listen configuration
app.listen(port, () => {
    console.log(`Running on PORT: ${port}`);
});
```

      - [ ] thingModel.js for use of the router.
```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const thingModel = new Schema({
    thingger: { type: String },
    thingy: { type: String },
    name: { type: String },
    used: { type: Boolean, default: false },
});

module.exports = mongoose.model('Thing', thingModel);
```

