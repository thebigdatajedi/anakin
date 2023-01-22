# QUESTION ABOUT:: Express Middleware app.use() and Why?

What is middleware?

- A request handler with access to the application's request-response cycle is known as middleware.
- Simply middleware is a function that can only be applied using routes.
- We can access and modify request and response data using middleware.

Function of Middleware

- Executes any code
- We can make changes to the request-response objects
- Middleware can also End the request-response cycle
- Middleware can call the next middleware function in a stack

We use these functions to modify our middleware to perform many tasks. If we want to block our site for some country or if we're going to check the authentication of a user etc., we use middleware for that.

## next()

- If the current middleware function does not end the request-response cycle, it must call `next()` to pass control to the next middleware function. Otherwise, the request will be left hanging.

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/ACE43BD5-CF32-4952-BC50-83E4CB9E36CA/A3050D6A-41CC-42FF-82AF-0A3B9F0825C6_2/FvCn0yqz1iBy5Ex0UdlJYBSGPwh2nIK3AejTZwPPHcoz/Image.png)

next() is called explicitly in the above code, implicitly in the below code.

```javascript
app.use('/api', bookRouter); //the middleware, in this case, is bookRouter because it's the callback that will handle the request and then next() to .get()

app.get('/', (req, res) => { //the middleware in this case is res.send() because it's the callback to handle the request then next() to .listen()
    res.send('Welcome the bookd API!');
});

//listen configuration
//the middleware is the lambda function that is wrapping console.log() and then next()
app.listen(port, () => {
    console.log(`Running on PORT: ${port}`);
});
```

In this code, similar to the one above in that it's console.log() is being wrapped in a anonymous function instead of a lambda but next() is explicitly called.

```javascript
const express = require('express')
const app = express()

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000)
```

Key takeaways are::

1. Middleware is a function that can mutate req and res.
2. next() is always there implicitly or explicitly, I'm guessing it's most suitable to be explicitly there when you are defining the middleware, like in the example right above, the user is defining middleware called myLogger then using in app.use() below the middleware definition.  So, again, middleware is a function that mutates req and res.

Sources::

[Express JS Middleware: Everything You Need to Know | Simplilearn](https://www.simplilearn.com/tutorials/express-js-tutorial/about-express-js-middleware)

[Writing middleware for use in Express apps](https://expressjs.com/en/guide/writing-middleware.html)

