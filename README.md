# Setting Up and Creating RESTful Web Services with Node.js, Express, MongoDb Atlas and Unit Testing

## Setting up your environment

- Download node LTS version.
- Create a project folder.
- CD to that project folder.
- Verify the version of node and npm using -v parameter.
- If you are satisfied with the version of node and npm you have installed run:: npm init
- Answer npm init questionnaire with mostly the defaults.
- The questionaire creates a package.json file in your project directory.
- run:: npm install express
- Express will show on the dependency list on package.json
- Create a new file in the project folder and call it app.js
- Add the following to your app.js file:
```javascript
var express = require('express');
var app = express();
```

- NOTE:: We break with the practice of using const because later will be demoing the use of ESLint to fix this and apply a specific style guide, in this case the Airbnb styleguide which all the JS geeks rave about.
- Add the following code to app.js.
```javascript
var port = process.env.PORT || 3000;
```

- app.js should now looks like this:
```javascript
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
```

- We are going to add a route to app.js just to do the initial bootstrap of the application because normally the routes would be placed in a folder structure like this:: /root_project/routes/index.js
- Add the following route to app.js::
```javascript
app.get('/', function (req, res) {
    res.send('Welcome to my API!');
});
```

- This is what your app.js file should look like now::
```javascript
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
app.get('/', function (req, res) {
    res.send('Welcome to my API!');
});
```

- Next we configure the listen() method for app.js::
```javascript
app.listen(port, function () {
    console.log('Running on PORT: ' + port);
});
```

- Your app.js file should now looks like this.
```javascript
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
app.get('/', function (req, res) {
    res.send('Welcome to my API!');
});
app.listen(port, function () {
    console.log('Running on PORT: ' + port);
});
```

- The code above is the minimal boiler plate code you need to run an application with Express.  With this code in place you have the essential express app.
- If you go to the terminal in your IDE and type in node app.js the application will run. You can verify that by going to localhost:3000::

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/69046318-833E-48F8-B393-2F8BE3F4280B/969F4A28-DE82-4065-823B-B894A26EB1A9_2/iz3o5xL2FNI7xsQniPCBhbsQwpbWpicH8aJeDDuXXKUz/Image.png)

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/69046318-833E-48F8-B393-2F8BE3F4280B/A1540EB2-C501-4E72-B33F-B56359D158F1_2/Fc6LNgvrzS6cGMRMci70kD7AABacEDLDRY2863kYKkEz/Image.png)

- We did all this manually to learn the fundamentals of setting up an Express app but express has a CLI for generating this code and more for an application and will create the very basic folder structure needed later for app resources.
- The instructions above show only part the work that the CLI does for you::
   - Install the express CLI tool globally:
```Bash
npm install express-generator -g
```

   - create a new express project
```Bash
express --view=ejs api
```

   - The generator creates a new express app called api. The --view flag tells the generator to use ejs template engine for the view files.
   - Access your directory:
      - cd api
   - **Folder structure should look like this:**

`+---bin`

`+---public`

`+---routes`

`+---views`

`+---app.js`

`+---package.json`

Your app.js with the CLI command  we just ran should look something like this::

```javascript
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
const api = require('./routes/api/index');
var app = express();

//This enabled CORS, Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts)
//on a web page to be requested from another domain outside the domain from which the first resource was served
app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/api', api);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
```

Notice that the CLI configures much more for you than is needed to run an app.

- All the basic npm modules.
- The Cross-origin resource sharing (CORS) configuration.
- The view engine set up.
- 404 catch set up
- The error handler for the app.

The above is a comparison contrast between the very basic boiler plate code manually built, and the code created by the Express CLI (express-generator).

## Now let's add some tools to our manually built express project.

### The two tools we will be learning how to use are::

1. ESLint - linting (Make sure we write our code the proper way.)
2. nodemon - (Handles restarting our application. And passing in the port and other configurations.)

## ESLint

- Before we install the tools our package.json looks like this::

```json
{
  "name": "express_rest",
  "version": "1.0.0",
  "description": "express rest tutorial",
  "main": "index.js",
  "scripts": {
    "test": "test"
  },
  "author": "F. Gabriel Cruz",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

- We are going to install ESLint as follows, run::
```Bash
npm i eslint -D
```

So the i is for install the package name and the -D means add it to our dev dependencies not our regular dependencies.

Our package.json looks like this:

```json
{
  "name": "express_rest",
  "version": "1.0.0",
  "description": "express rest tutorial",
  "main": "index.js",
  "scripts": {
    "test": "test"
  },
  "author": "F. Gabriel Cruz",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "eslint": "^8.32.0"
  }
}
```

The reason we want to cordon off the dev dependencies in it's own little closure is that when it deploys to production and the deployment does the npm install it's not going to install the dev dependencies items in the devDependencies section of the package.json.

Now we are going to run all of our linting from our script section of the package.json.

```json
{
  "name": "express_rest",
  "version": "1.0.0",
  "description": "express rest tutorial",
  "main": "index.js",
  "scripts": {
    "lint": "eslint .",
    "test": "test"
  },
  "author": "F. Gabriel Cruz",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "eslint": "^8.32.0"
  }
}
```

Now we are going to run ESlint and notice how we are going to run it::

```Bash
npm run lint -- --init
```

First we are doing an npm run which is for script commands that are custom or not the standard script (start and test).  So if you put a new script in the script section of package.json and decide to call it "applepie" then you have to call it with npm run::

npm run applepie

As opposed to start and test that are::

```Bash
npm start
```

&

```Bash
npm test
```

Second after the lint we have -- or minus minus which means whatever parameter come after -- pass it or them into the script that is being called.

Third we are passing in --init parameter which will run ESLint but will have us fill out a questionnaire to configure ESLint.

Below is the way I configured my ESLint, how you configure ESLint is a matter of team culture and desired outcomes.  Please configure your linter as you need.  Notice that I did three things that worthy of notice.

1. I used the airbnb style guide because it's the preferred style guide and
2. I selected format for config files to be in Javascript.
3. ESLint asks if we want to install the packages that go with the config selected and the response given is Yes and use npm to do said install.  npm proceeds to do the install.

```Bash
npm run lint -- --init

> express_rest@1.0.0 lint
> eslint . --init

You can also run this command directly using 'npm init @eslint/config'.
Need to install the following packages:
  @eslint/create-config@0.4.2
Ok to proceed? (y) y
✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · commonjs
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · Node
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · airbnb
✔ What format do you want your config file to be in? · JavaScript
Checking peerDependencies of eslint-config-airbnb-base@latest
The config that you've selected requires the following dependencies:

eslint-config-airbnb-base@latest eslint@^7.32.0 || ^8.2.0 eslint-plugin-import@^2.25.2
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · npm
Installing eslint-config-airbnb-base@latest, eslint@^7.32.0 || ^8.2.0, eslint-plugin-import@^2.25.2

added 67 packages, and audited 225 packages in 6s

74 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Successfully created .eslintrc.js file in /XXXX/XXXX
```

Notice what package.json looks like now::

```json
{
  "name": "express_rest",
  "version": "1.0.0",
  "description": "express rest tutorial",
  "main": "index.js",
  "scripts": {
    "lint": "eslint .",
    "test": "test"
  },
  "author": "F. Gabriel Cruz",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "eslint": "^8.32.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.27.5"
  }
}
```

Now we are going to run::

```Bash
npm run lint
```

This is what the output to the initial manual app.js creation looks like for the linter.

```Bash
npm run lint

> express_rest@1.0.0 lint
> eslint .


app.js
  1:1   error    Unexpected var, use let or const instead                                       no-var
  1:1   error    Expected 1 empty line after require statement not followed by another require  import/newline-after-import
  2:1   error    Unexpected var, use let or const instead                                       no-var
  3:1   error    Unexpected var, use let or const instead                                       no-var
  4:14  error    Unexpected function expression                                                 prefer-arrow-callback
  4:14  warning  Unexpected unnamed function                                                    func-names
  5:1   error    Expected indentation of 2 spaces but found 4                                   indent
  7:18  error    Unexpected function expression                                                 prefer-arrow-callback
  7:18  warning  Unexpected unnamed function                                                    func-names
  8:1   error    Expected indentation of 2 spaces but found 4                                   indent
  8:5   warning  Unexpected console statement                                                   no-console
  8:17  error    Unexpected string concatenation                                                prefer-template

✖ 12 problems (9 errors, 3 warnings)
  9 errors and 0 warnings potentially fixable with the `--fix` option.
```

Notice how it makes a suggestion to run --fix.

We run --fix::

```Bash
npm run lint -- --fix
```

This is the output it gives::

```Bash
npm run lint -- --fix

> express_rest@1.0.0 lint
> eslint . --fix


/Users/franciscocruz/wrk/express_rest/app.js
  9:3  warning  Unexpected console statement  no-console

✖ 1 problem (0 errors, 1 warning)
```

It fixed everything it considered an error and it doesn't like my console statement on line 9 but it's reporting that as a warning.

Here is what the code looks like now::

```javascript
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});
app.listen(port, () => {
  console.log(`Running on PORT: ${port}`);
});
```

Notice it replaced the vars with const and it tightened up the neatness of the spacing to match the style guide.

Our tiny little app is now worthy of Airbnb.

Notice that the Express CLI generated code doesn't have the Airbnb style guide applied to it.  Here is what it looks like right after being generated by Express:

```javascript
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
const api = require('./routes/api/index');
var app = express();

//This enabled CORS, Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts)
//on a web page to be requested from another domain outside the domain from which the first resource was served
app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/api', api);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
```

Lets install, run and fix that Express generated code project with ESLint and see what the code changes into with the Airbnb style guide applied.

Before I show you the changes made to app.js, because the Express generated code project if further along ESLint recursively checked the project root dir and sub dirs and linted every file in the project directory structure.

Here is the reason why I'm grateful that the --fix option exists.  Look at all these errors and warnings:

```other
app.js
   1:1    error    Unexpected var, use let or const instead                                                            no-var
   2:1    error    Unexpected var, use let or const instead                                                            no-var
   3:1    error    Unexpected var, use let or const instead                                                            no-var
   3:5    error    'favicon' is assigned a value but never used                                                        no-unused-vars
   4:1    error    Unexpected var, use let or const instead                                                            no-var
   5:1    error    Unexpected var, use let or const instead                                                            no-var
   6:1    error    Unexpected var, use let or const instead                                                            no-var
   6:18   error    'body-parser' should be listed in the project's dependencies. Run 'npm i -S body-parser' to add it  import/no-extraneous-dependencies
   8:1    error    Unexpected var, use let or const instead                                                            no-var
   9:1    error    Expected 1 empty line after require statement not followed by another require                       import/newline-after-import
  10:1    error    Unexpected var, use let or const instead                                                            no-var
  12:1    error    Expected exception block, space or tab after '//' in comment                                        spaced-comment
  13:1    error    Expected exception block, space or tab after '//' in comment                                        spaced-comment
  14:1    error    Expected exception block, space or tab after '//' in comment                                        spaced-comment
  19:108  error    Unexpected line break after this opening brace                                                      object-curly-newline
  20:24   error    Unexpected trailing comma                                                                           comma-dangle
  20:25   error    A space is required before '}'                                                                      object-curly-spacing
  22:1    error    This line has a length of 118. Maximum allowed is 100                                               max-len
  22:1    error    Expected exception block, space or tab after '//' in comment                                        spaced-comment
  23:1    error    This line has a length of 111. Maximum allowed is 100                                               max-len
  23:1    error    Expected exception block, space or tab after '//' in comment                                        spaced-comment
  24:15   error    Unexpected function expression                                                                      prefer-arrow-callback
  24:15   warning  Unexpected unnamed function                                                                         func-names
  24:23   error    Missing space before function parentheses                                                           space-before-function-paren
  26:14   error    Strings must use singlequote                                                                        quotes
  26:45   error    Strings must use singlequote                                                                        quotes
  30:18   error    Expected '===' and instead saw '=='                                                                 eqeqeq
  40:1    error    Expected exception block, space or tab after '//' in comment                                        spaced-comment
  48:1    error    Expected exception block, space or tab after '//' in comment                                        spaced-comment
  50:9    error    Unexpected function expression                                                                      prefer-arrow-callback
  50:9    warning  Unexpected unnamed function                                                                         func-names
  50:17   error    Missing space before function parentheses                                                           space-before-function-paren
  51:3    error    Unexpected var, use let or const instead                                                            no-var
  56:9    error    Unexpected function expression                                                                      prefer-arrow-callback
  56:9    warning  Unexpected unnamed function                                                                         func-names
  56:17   error    Missing space before function parentheses                                                           space-before-function-paren
  56:33   error    'next' is defined but never used                                                                    no-unused-vars
  64:22   error    Newline required at end of file but not found                                                       eol-last
```

```other
/controllers/appointments.js
   2:7   error    A space is required after '{'                                                  object-curly-spacing
   2:35  error    A space is required before '}'                                                 object-curly-spacing
   3:1   error    Expected 1 empty line after require statement not followed by another require  import/newline-after-import
   3:15  error    `@vonage/server-sdk` import should occur before import of `../models/index`    import/order
   5:1   error    Expected indentation of 2 spaces but found 4                                   indent
   6:1   error    Expected indentation of 4 spaces but found 8                                   indent
   7:1   error    Expected indentation of 4 spaces but found 8                                   indent
   7:9   error    'Appointment' is not defined                                                   no-undef
   8:1   error    Expected indentation of 2 spaces but found 4                                   indent
   9:1   error    Expected indentation of 2 spaces but found 4                                   indent
   9:5   warning  Unexpected unnamed method 'create'                                             func-names
   9:5   error    Expected method shorthand                                                      object-shorthand
  10:1   error    Expected indentation of 4 spaces but found 8                                   indent
  10:9   error    Unexpected var, use let or const instead                                       no-var
  12:1   error    Expected indentation of 4 spaces but found 8                                   indent
  14:1   error    More than 1 blank line not allowed                                             no-multiple-empty-lines
  15:1   error    Expected indentation of 4 spaces but found 8                                   indent
  16:1   error    Expected indentation of 4 spaces but found 8                                   indent
  17:1   error    Expected indentation of 4 spaces but found 8                                   indent
  18:1   error    Expected indentation of 4 spaces but found 8                                   indent
  20:1   error    Expected indentation of 4 spaces but found 8                                   indent
  22:1   error    Expected indentation of 4 spaces but found 8                                   indent
  23:1   error    Expected indentation of 4 spaces but found 8                                   indent
  24:1   error    Expected indentation of 4 spaces but found 8                                   indent
  25:1   error    Expected indentation of 4 spaces but found 8                                   indent
  26:1   error    Expected indentation of 4 spaces but found 8                                   indent
  27:1   error    Expected indentation of 4 spaces but found 8                                   indent
  28:1   error    Expected indentation of 4 spaces but found 8                                   indent
  30:1   error    Expected indentation of 4 spaces but found 8                                   indent
  31:1   error    Expected indentation of 4 spaces but found 8                                   indent
  32:1   error    Expected indentation of 4 spaces but found 8                                   indent
  33:1   error    Expected indentation of 4 spaces but found 8                                   indent
  33:34  error    Unexpected dangling '_' in '_id'                                               no-underscore-dangle
  34:1   error    Expected indentation of 4 spaces but found 8                                   indent
  34:13  error    'newappointment' is never reassigned. Use 'const' instead                      prefer-const
  36:1   error    Expected indentation of 4 spaces but found 8                                   indent
  37:1   error    Expected indentation of 6 spaces but found 12                                  indent
  37:21  error    Strings must use singlequote                                                   quotes
  38:1   error    Expected indentation of 6 spaces but found 12                                  indent
  38:24  error    Strings must use singlequote                                                   quotes
  38:41  error    Missing trailing comma                                                         comma-dangle
  39:1   error    Expected indentation of 4 spaces but found 8                                   indent
  40:1   error    Expected indentation of 4 spaces but found 8                                   indent
  40:13  error    'msg' is never reassigned. Use 'const' instead                                 prefer-const
  40:17  error    There should be no line break before or after '='                              operator-linebreak
  41:13  error    Unexpected string concatenation                                                prefer-template
  41:30  error    '+' should be placed at the beginning of the line                              operator-linebreak
  42:13  error    Strings must use singlequote                                                   quotes
  42:17  error    '+' should be placed at the beginning of the line                              operator-linebreak
  43:13  error    Strings must use singlequote                                                   quotes
  43:62  error    '+' should be placed at the beginning of the line                              operator-linebreak
  44:13  error    Strings must use singlequote                                                   quotes
  44:17  error    '+' should be placed at the beginning of the line                              operator-linebreak
  46:1   error    Expected indentation of 4 spaces but found 8                                   indent
  47:1   error    Expected indentation of 4 spaces but found 8                                   indent
  48:1   error    Expected indentation of 4 spaces but found 8                                   indent
  49:1   error    Expected indentation of 6 spaces but found 12                                  indent
  50:1   error    Expected indentation of 6 spaces but found 12                                  indent
  51:1   error    Expected indentation of 6 spaces but found 12                                  indent
  51:13  error    'Appointment' is not defined                                                   no-undef
  51:30  error    A space is required after '{'                                                  object-curly-spacing
  51:36  error    Unexpected dangling '_' in '_id'                                               no-underscore-dangle
  51:45  error    A space is required before '}'                                                 object-curly-spacing
  52:1   error    Expected indentation of 8 spaces but found 16                                  indent
  52:27  error    Strings must use singlequote                                                   quotes
  53:1   error    Expected indentation of 8 spaces but found 16                                  indent
  53:24  error    'err' is already declared in the upper scope on line 48 column 30              no-shadow
  54:1   error    Expected indentation of 6 spaces but found 12                                  indent
  54:26  error    'VIRTUAL_NUMBER' is not defined                                                no-undef
  55:1   error    Expected indentation of 6 spaces but found 12                                  indent
  55:24  error    'RECIPIENT_NUMBER' is not defined                                              no-undef
  56:1   error    Expected indentation of 6 spaces but found 12                                  indent
  56:51  error    'err' is already declared in the upper scope on line 48 column 30              no-shadow
  57:1   error    Expected indentation of 8 spaces but found 16                                  indent
  58:1   error    Expected indentation of 10 spaces but found 20                                 indent
  58:21  warning  Unexpected console statement                                                   no-console
  59:1   error    Expected indentation of 8 spaces but found 16                                  indent
  60:1   error    Expected indentation of 10 spaces but found 20                                 indent
  60:21  warning  Unexpected console statement                                                   no-console
  61:1   error    Expected indentation of 8 spaces but found 16                                  indent
  62:1   error    Expected indentation of 6 spaces but found 12                                  indent
  63:1   error    Expected indentation of 4 spaces but found 8                                   indent
  64:1   error    Expected indentation of 2 spaces but found 4                                   indent
  64:6   error    Missing trailing comma                                                         comma-dangle
  66:40  error    Newline required at end of file but not found                                  eol-last
```

```other
/controllers/slot.js
  3:1   error  Expected indentation of 2 spaces but found 4   indent
  4:1   error  Expected indentation of 4 spaces but found 8   indent
  5:1   error  Expected indentation of 4 spaces but found 8   indent
  5:9   error  'Slot' is not defined                          no-undef
  6:1   error  Expected indentation of 6 spaces but found 12  indent
  6:51  error  Missing semicolon                              semi
  7:1   error  Expected indentation of 2 spaces but found 4   indent
  7:6   error  Missing trailing comma                         comma-dangle
  9:15  error  Multiple spaces found before '='               no-multi-spaces
  9:34  error  Newline required at end of file but not found  eol-last
```

```other
/models/index.js
   1:1   error  Expected 1 empty line after require statement not followed by another require  import/newline-after-import
   2:1   error  Split 'const' declarations into multiple statements                            one-var
   2:7   error  Use object destructuring                                                       prefer-destructuring
   3:1   error  Expected indentation of 2 spaces but found 4                                   indent
   4:1   error  Expected indentation of 2 spaces but found 4                                   indent
   4:5   error  Use object destructuring                                                       prefer-destructuring
   6:1   error  Expected indentation of 2 spaces but found 4                                   indent
   7:1   error  Expected indentation of 2 spaces but found 4                                   indent
   8:1   error  Expected indentation of 2 spaces but found 4                                   indent
   8:21  error  Missing trailing comma                                                         comma-dangle
  22:1   error  Expected indentation of 2 spaces but found 4                                   indent
  23:1   error  Expected indentation of 2 spaces but found 4                                   indent
  24:1   error  Expected indentation of 2 spaces but found 4                                   indent
  25:1   error  Expected indentation of 2 spaces but found 4                                   indent
  26:1   error  Expected indentation of 2 spaces but found 4                                   indent
  26:12  error  A space is required after '{'                                                  object-curly-spacing
  26:45  error  A space is required before '}'                                                 object-curly-spacing
  27:1   error  Expected indentation of 2 spaces but found 4                                   indent
  27:21  error  Missing trailing comma                                                         comma-dangle
  32:1   error  Expected indentation of 2 spaces but found 4                                   indent
  33:1   error  Expected indentation of 2 spaces but found 4                                   indent
  34:3   error  Newline required at end of file but not found                                  eol-last
```

```other
/models/slot.js
   1:15  error  Identifier 'slot_time' is not in camel case                camelcase
   1:26  error  Identifier 'slot_date' is not in camel case                camelcase
   1:37  error  Identifier 'created_at' is not in camel case               camelcase
   2:1   error  Expected indentation of 2 spaces but found 4               indent
   2:22  error  Identifier 'slot_time' is not in camel case                camelcase
   3:1   error  Expected indentation of 2 spaces but found 4               indent
   3:22  error  Identifier 'slot_date' is not in camel case                camelcase
   4:1   error  Expected indentation of 2 spaces but found 4               indent
   4:23  error  Identifier 'created_at' is not in camel case               camelcase
   8:1   error  Expected indentation of 2 spaces but found 4               indent
  10:1   error  Too many blank lines at the end of file. Max of 0 allowed  no-multiple-empty-lines

/routes/api/index.js
  1:1   error  Unexpected var, use let or const instead                                       no-var
  2:1   error  Split 'const' declarations into multiple statements                            one-var
  2:34  error  Expected variable declaration to be on a new line                              one-var-declaration-per-line
  3:1   error  Expected 1 empty line after require statement not followed by another require  import/newline-after-import
  3:1   error  Expected indentation of 2 spaces but found 4                                   indent
  7:25  error  Newline required at end of file but not found                                  eol-last

/routes/index.js
  1:1   error    Unexpected var, use let or const instead                                       no-var
  1:1   error    Expected 1 empty line after require statement not followed by another require  import/newline-after-import
  2:1   error    Unexpected var, use let or const instead                                       no-var
  4:17  error    Unexpected function expression                                                 prefer-arrow-callback
  4:17  warning  Unexpected unnamed function                                                    func-names
  4:37  error    'next' is defined but never used                                               no-unused-vars
  5:1   error    Expected indentation of 2 spaces but found 4                                   indent
  5:25  error    A space is required after '{'                                                  object-curly-spacing
  5:54  error    A space is required before '}'                                                 object-curly-spacing

/routes/users.js
  1:1   error    Unexpected var, use let or const instead                                       no-var
  1:1   error    Expected 1 empty line after require statement not followed by another require  import/newline-after-import
  2:1   error    Unexpected var, use let or const instead                                       no-var
  5:17  error    Unexpected function expression                                                 prefer-arrow-callback
  5:17  warning  Unexpected unnamed function                                                    func-names
  5:25  error    Missing space before function parentheses                                      space-before-function-paren
  5:36  error    'next' is defined but never used                                               no-unused-vars
```

That is a lot of errors and warnings to fix manually. It's great to be able to make the first pass at it with --fix

Here is what app.js looks like after --fix

```javascript
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const index = require('./routes/index');
const api = require('./routes/api/index');

const app = express();
// This enabled CORS, Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts)
// on a web page to be requested from another domain outside the domain from which the first resource was served
app.all('/*', (req, res, next) => {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/api', api);
// app.use('/users', users);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
```

Notice the change from var to const and the spacing in the app.

## nodemon

- run::
```Bash
npm install nodemon
```

- nodemon is added to package.json
- And in order to use nodeman we add it to our start script and we add a config section for nodemon::
```json
{
  "name": "express_rest",
  "version": "1.0.0",
  "description": "express rest tutorial",
  "main": "index.js",
  "scripts": {
    "lint": "eslint .",
    "start": "nodemon app.js",
    "test": "test"
  },
  "author": "F. Gabriel Cruz",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "nodemon": "^2.0.20"
  },
  "devDependencies": {
    "eslint": "^8.32.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.27.5"
  },
  "nodemonConfig": {
    "restartable": "rs",
    "ignore": [
      "node_modules/**/node_modules"
    ],
    "delay": 2500,
    "env": {
      "NODE_ENV": "development",
        "PORT": 4000
    }
  }
}
```

- run::
```Bash
npm start
```

- (Notice I didn't have to type npm run start, I just had to type npm start.  As stated before start and test are the only script verbs that don't require run in front of them.)
- This is the output to npm start::
```Bash
npm start

> express_rest@1.0.0 start
> nodemon app.js

[nodemon] 2.0.20
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
Running on PORT: 4000
```

- This is the app running on nodemon

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/69046318-833E-48F8-B393-2F8BE3F4280B/DF91D4B6-A970-4903-A60D-CC1672F37B33_2/bdHqOIfe6O2VPgKm1dARxFqHsCqAmzmx12kxMbCAJTgz/Image.png)

- Added text to app.js
```javascript
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Welcome to my Nodemon API!, Im running on port 4000');
});
app.listen(port, () => {
  console.log(`Running on PORT: ${port}`);
});
```

- Nodemon runs automatically on saving the file.
```Bash
npm start

> express_rest@1.0.0 start
> nodemon app.js

[nodemon] 2.0.20
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
Running on PORT: 4000
[nodemon] restarting due to changes...
[nodemon] starting `node app.js`
Running on PORT: 4000
```

This concludes setting up the environment and tooling.

## Writing the actual RESTful Service from scratch.

## Implementing HTTP GET

- Go into app.js and add an express router.
- Your app.js should look something like this.
```javascript
const express = require('express');

const app = express();
const bookRouter = express.Router();
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('Welcome to my Nodemon API!, Im running on port 4000 - more');
});
app.listen(port, () => {
  console.log(`Running on PORT: ${port}`);
});
```

So,

1. Create the router as shown above.
2. Then configure the router as shown in the code below
3. Then wire up the router as shown below (use the router)

```javascript
const express = require('express');

const app = express();
//first create the router
const bookRouter = express.Router();
const port = process.env.PORT || 3000;

//then configure the router
bookRouter('/books')
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
```

This code above is getting the following error:

```Bash
Node.js v18.13.0
[nodemon] app crashed - waiting for file changes before starting...
[nodemon] restarting due to changes...
[nodemon] starting `node app.js`
/node_modules/express/lib/router/index.js:161
  req.next = next;
           ^

TypeError: Cannot create property 'next' on string '/books'
    at Function.handle (/node_modules/express/lib/router/index.js:161:12)
    
Node.js v18.13.0
[nodemon] app crashed - waiting for file changes before starting...
```

Looks like I forgot the .route() method for the bookRouter.  Please see below:

```javascript
const express = require('express');

const app = express();
//first create the router
const bookRouter = express.Router();
const port = process.env.PORT || 3000;

//then configure the router
bookRouter.route('/books')
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
```

The error was gone when I called bookRouter.route()

Works now::

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/69046318-833E-48F8-B393-2F8BE3F4280B/09F3CAFE-EDB9-49C5-98F0-0125F8AEC10B_2/mz5P3EreKrP5xBVEZCNIdnxomZ4lgYArSA5AmlVKja4z/Image.png)

## Wiring up MongoDB Atlas (MongoDB in the cloud!)

- There are a lot of mongod client examples out there, since we are using MongoDB in the cloud and not local install we will be using mongosh (Pronounced mongo-sh - but I like calling it mon-gosh.) for a REPL or CLI client and Compass and DataGrip for GUI. You decide which one you like best out of those three and any other out there.
- Install the mongodb shell, run::
```Bash
brew install mongosh
```

- run mongosh passing it the connection string in the format below and with the --apiVersion and --username parameters in the shell you just installed mongosh in::
```Bash
mongosh "mongodb+srv://<cluster_name>.<unique_identifier>.mongodb.net/r<database_name>" --apiVersion 1 --username <user_name>
```

   - You will be prompted for the password for the Database User. When entering your password, make sure all special characters are [URL encoded](https://dochub.mongodb.org/core/atlas-url-encoding).
- If you also want to install Compass which is Mongo's own client for MongoDB Atlas (in the cloud).
   - Download and install Compass.
   - The new connection modal will be open when Compass loads.
      - Otherwise click on your previously saved connection.
   - Past your connection string in the URI box in the New Connection modal::
```Bash
mongodb+srv://<database_user>:<password>@<cluster_name>.<unique_identifier>.mongodb.net/test
```

      - The Advanced Connection Options allows you to configure a connection to MongoDb that is installed locally.
   - If you wish to connect from Jetbrain's DataGrip click on the + sign on the upper right hand side of the Database Explorer.
   - Select Data Source
   - Select MongoDB
   - Fill out this form:

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/69046318-833E-48F8-B393-2F8BE3F4280B/CBE0F6AB-81FB-40E5-AFC1-A75DF2A2B0CA_2/lHGDjeRRM5BTAHgM0KjxSxQ6gYPUeZR8kQ7wsUB5j2Yz/Image.png)

      - Make sure your fields are filled and particularly the URL field because if you get that one right you are golden and DataGrip will remove the <password> in the url by "hiding" it as soon as you put it in::
```Bash
mongodb+srv://<database_user>:<password>@<cluster_name>.<unique_identifier>.mongodb.net/<database_name>
```

   - These are your options for connecting MongoDB Atlas (MongoDB in the cloud.).
- ## Definition of REPL
   - REPL (Read-eval-print-loop) - I will be using the term REPL to describe the use of the the command line interface that is app specific or that presents when mongosh is loaded to memory.  Many tools have a REPLs some people refer to them by other words session or shell or session shell or CLI. REPL stands for Read–eval–print loop.  Tool like Node.js, Python have REPLs for testing code, tools like SPARK's main interface is a REPL in which you treat the REPL like a CLI to communicate with the cluster and do tasks like run jobs.  In our case there are 3 ways to communicate with MongoDb Atlas one of them is mongosh which stands for mongo shell and is a different interface than mongod CLI or REPL and the commands are different people use mongod because it's a traditional local install of MongoDb where mongosh is a more recent tool and suited for MongoDb Atlas (cloud MongoDb).
   - I'm sure mongosh can be used with with a local MongoDb if you pass it the connection string of a local db to connect to but that's not what we are doing today, Because there are a lot of example using the mongod CLI or REPL we are reaching task parity for mongosh (mongo-sh) or as I like to call it mon-gosh.

### Logging in through the REPL

- First you log into the mongosh REPL::
```Bash
mongosh "mongodb+srv://<cluster_name>.<unique_identifier>.mongodb.net/<data_base>" --apiVersion 1 --username <user_name>
```

- This command will cause the REPL to ask for your password.
- Type password and log in.
- Atlas MongoDb doesn't have a create verb, it will create the db if it doesn't exist when you ask it to::
```Bash
use <db_name>
```

## Loading sample data with mongosh.

- list dbs::
```Bash
show dbs
```

- switch context to the db you want from the ones listed when you ran show dbs or creates the db if it doesn't exist::
```Bash
use <db_name>
```

- load the data by running the insertMany() JS script::
```Bash
load('<js_file_path>')
```

- In this case the <js_file_path> would be for the bookJson.js file shown below.
```Bash
load('/project_root/booksJson.js')
```

- NOTE:: The example that I found used .insert() method but mongosh responded that .insert() had been deprecated and that .insertOne(), .insertMany() and .insertAll() were the methods to use. ::
```javascript
db.books.insertMany([
{
	title: 'War and Peace',
	genre: 'Historical Fiction',
	author: 'Lev Nikolayevich Tolstoy',
	read: false
},
{
	title: 'Les Misérables',
	genre: 'Historical Fiction',
	author: 'Victor Hugo',
	read: false
},
{
	title: 'The Time Machine',
	genre: 'Science Fiction',
	author: 'H. G. Wells',
	read: false
},
{
	title: 'A Journey into the Center of the Earth',
	genre: 'Science Fiction',
	author: 'Jules Verne',
	read: false
},
{
	title: 'The Dark World',
	genre: 'Fantasy',
	author: 'Henry Kuttner',
	read: false
},
{
	title: 'The Wind in the Willows',
	genre: 'Fantasy',
	author: 'Kenneth Grahame',
	read: false
},
{
	title: 'Life On The Mississippi',
	genre: 'History',
	author: 'Mark Twain',
	read: false
},
{
	title: 'Childhood',
	genre: 'Biography',
	author: 'Lev Nikolayevich Tolstoy',
	read: false
}
])
```

- The data in the javascript file which states the collection name it needs to use or create by the notation db.books.insertMany() (collection being books - note there is no separate create collection step in this javascript file).
- Verify that your data is in MongoDb Atlas through the mongosh REPL::

this command in the REPL lists  all the dbs::

```Bash
show dbs
```

will switch to the to the db context for the db name being used. You need to switch context to the db_name in order to do the next step which is list collections::

```Bash
use <db_name>
```

lists all the collections in the db you just named with the use command::

```Bash
show collections
```

Note below that when I tried to use bookApi the REPL explained that I was already in that context.

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/69046318-833E-48F8-B393-2F8BE3F4280B/2843FBE7-BA9D-4DC5-86D6-AB9AD1D9D14D_2/8e6Kmp3yxPygZaZ4dm5CVbyWuyUhSpw12ZkWPkuPA1wz/Image.png)

To list all the records inside a collection then in the context of the db you run::

```Bash
db.collectionName.find()
```

Example:

```Bash
db.books.find()
```

NOTE:: the REPL code below and its output is a list of books::

```javascript
Atlas atlas-14jzen-shard-0 [primary] bookApi> db.books.find()
[
  {
    _id: ObjectId("63c9eabf15f753e6c9914303"),
    title: 'War and Peace',
    genre: 'Historical Fiction',
    author: 'Lev Nikolayevich Tolstoy',
    read: false
  },
  {
    _id: ObjectId("63c9eabf15f753e6c9914304"),
    title: 'Les Misérables',
    genre: 'Historical Fiction',
    author: 'Victor Hugo',
    read: false
  },
  {
    _id: ObjectId("63c9eabf15f753e6c9914305"),
    title: 'The Time Machine',
    genre: 'Science Fiction',
    author: 'H. G. Wells',
    read: false
  },
  {
    _id: ObjectId("63c9eabf15f753e6c9914306"),
    title: 'A Journey into the Center of the Earth',
    genre: 'Science Fiction',
    author: 'Jules Verne',
    read: false
  },
  {
    _id: ObjectId("63c9eabf15f753e6c9914307"),
    title: 'The Dark World',
    genre: 'Fantasy',
    author: 'Henry Kuttner',
    read: false
  },
  {
    _id: ObjectId("63c9eabf15f753e6c9914308"),
    title: 'The Wind in the Willows',
    genre: 'Fantasy',
    author: 'Kenneth Grahame',
    read: false
  },
  {
    _id: ObjectId("63c9eabf15f753e6c9914309"),
    title: 'Life On The Mississippi',
    genre: 'History',
    author: 'Mark Twain',
    read: false
  },
  {
    _id: ObjectId("63c9eabf15f753e6c991430a"),
    title: 'Childhood',
    genre: 'Biography',
    author: 'Lev Nikolayevich Tolstoy',
    read: false
  },
  {
    _id: ObjectId("63c9eb1a15f753e6c991430b"),
    title: 'War and Peace',
    genre: 'Historical Fiction',
    author: 'Lev Nikolayevich Tolstoy',
    read: false
  },
  {
    _id: ObjectId("63c9eb1a15f753e6c991430c"),
    title: 'Les Misérables',
    genre: 'Historical Fiction',
    author: 'Victor Hugo',
    read: false
  },
  {
    _id: ObjectId("63c9eb1a15f753e6c991430d"),
    title: 'The Time Machine',
    genre: 'Science Fiction',
    author: 'H. G. Wells',
    read: false
  },
  {
    _id: ObjectId("63c9eb1a15f753e6c991430e"),
    title: 'A Journey into the Center of the Earth',
    genre: 'Science Fiction',
    author: 'Jules Verne',
    read: false
  },
  {
    _id: ObjectId("63c9eb1a15f753e6c991430f"),
    title: 'The Dark World',
    genre: 'Fantasy',
    author: 'Henry Kuttner',
    read: false
  },
  {
    _id: ObjectId("63c9eb1a15f753e6c9914310"),
    title: 'The Wind in the Willows',
    genre: 'Fantasy',
    author: 'Kenneth Grahame',
    read: false
  },
  {
    _id: ObjectId("63c9eb1a15f753e6c9914311"),
    title: 'Life On The Mississippi',
    genre: 'History',
    author: 'Mark Twain',
    read: false
  },
  {
    _id: ObjectId("63c9eb1a15f753e6c9914312"),
    title: 'Childhood',
    genre: 'Biography',
    author: 'Lev Nikolayevich Tolstoy',
    read: false
  }
]
Atlas atlas-14jzen-shard-0 [primary] bookApi>
```

## Creating a model for Express and MongoDb with mongoose

1. npm install mongoose
2. Do a CommonJS import of mongoose.
3. pull Schema out of mongoose using destructure notation.
4. set the const bookModel by newing up Schema by passing the Schema constructor a JSON object that describes the schema of bookModel.
5. then module.export that by wrapping it in a mongoose.model() method with 'Book' string as it's first parameter and the bookModel schema as it's second parameter.

This is what the code looks like::

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookModel = new Schema({
    title: { type: String },
    author: { type: String },
    genre: { type: String },
    read: { type: Boolean, default: false },
});

module.exports = mongoose.model('Book', bookModel);
```

## Pulling data out of MongoDb with Express

This is what the code looks like for pulling data out of MongoDB with Express in JSON format::

```javascript
const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://<username>:<password>@<cluster_name>.<unique_identifier>.mongodb.net/<db_name>');

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
```

The key is that the connection string needed a reference to the db.

The connection string has a ref to::

1. the cluster
2. the db

So, that leaves the ORM to do its thing and abstracts the collection in this way::

```javascript
//create the book model
const Book = require('./models/bookModel');
```

bookModel.js module.exports a Schema wrapped in a Model.

It's like this built in dependency injection feature the language has.

Then the methods that the Book object has are for operating on the collection.

Here is all the methods available to Book::

[Mongoose v6.8.4: Model](https://mongoosejs.com/docs/api/model.html)

These are all the methods traditionally available in an ORM to table objects or a Kafka topic objects.

In this case a collection of documents.

You can think of a collection of documents as a table of rows or a topic of messages, a collection of documents.

In the code below the method that the Book model is using is **.find() with an error parameter for processing any errors that comes back** and a **books parameter for processing the json coming back** from the collection.

```javascript
Book.find((err, books) => {
            if (err) {
                return res.send(err);
            }
            return res.json(books);
        });
```

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/69046318-833E-48F8-B393-2F8BE3F4280B/1D1DAD80-60AF-4D86-8BD9-4AC4C007D9A1_2/esgVM0hGw00WxilzCSOo7giebv3ssaLOuWUM9dpfc4gz/Image.png)

### Filtering with a Query String

What Destructuring Does in JavaScript::

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

The way destructuring appears to work is the variable target value is the value of the constituent member of the object being poled and it appears that the constituent member or member has the same name as the variable and this is how the virtual machine knows what value to set the target.

In the example above the target is query and is part of request hence we are using the destructuring feature in JavaScript. This allows for the use of the hook query feature (?) on the address bar of the browser which comes into the program via a req object and used in the .find() method, which appears is overloaded to handle a query parameter.

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/69046318-833E-48F8-B393-2F8BE3F4280B/77DAB511-C019-41E5-9178-A181F5E27403_2/we18BmrTSa6Id6MV09LqFmbv5e4rR2wXJYM5QYJK89Yz/Image.png)

### Getting a Single Item

Here is what the code looks like for this task::

```javascript
const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://<username>:<password>@anakin.2wbl4uu.mongodb.net/bookApi');

//first create the router
const bookRouter = express.Router();
const port = process.env.PORT || 3000;

//create the book model
const Book = require('./models/bookModel');
//books = Book.db.collection('books');

//pulling multi book data from MongoDB with Express
bookRouter.route('/books')
    .get((req, res) => {
        //fixing query to weed out junk data
        let query = {};

        //if the query is junk then return all books
        if (req.query.genre) {
            query.genre = req.query.genre;
        }else if (req.query.author) {
            query.author = req.query.author;
        }else if (req.query.title) {
            query.title = req.query.title;
        }else if (req.query.read) {
            query.read = req.query.read;
        }else {
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
```

Here is what the http response in json looks like::

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/69046318-833E-48F8-B393-2F8BE3F4280B/312FABC7-36C5-4335-A96E-58A68F859531_2/V6jI9tKYax3DB9HoNqe4P1F9vF96WOKXEPP3iB29UuQz/Image.png)

