# What Destructuring Does in JavaScript.

```javascript
//pulling data from MongoDB with Express
bookRouter.route('/books')
    .get((req, res) => {
        const { query } = req;
        Book.find(query, (err, books) => {
            if (err) {
                return res.send(err);
            }
            return res.json(books);
        });
    });
```

The way destructuring appears to work is the variable target value is the value of constituent member of the object being poled and it appears that the constituent member or member has the same name as the variable and this is how the virtual machine know what value to set the target.

In the example above the target is query and is part of request hence we are using the destructuring feature in JavaScript. This allows for the proverbial hook query on the address bar of the browser which comes into the program via a req object and used in the .find() method, which is overloaded to handle a query parameter.

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/2AA364AC-C207-42F0-9F07-DBE06306F291/F993B7A4-EE64-4999-94BC-848F484C5A2E_2/COD2PW8LARj1mHACDzvoIA1kc8nWWNDygbW3ysroweUz/Image.png)

