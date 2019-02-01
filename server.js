// dev key 4qY7lqQw8NOl9gng0ZHgT4xdiDqxqoGVutuZwrUYQsI
const express = require('express');
const session = require('express-session');

const app = express();
app.use(
    express.json(),
    express.static(__dirname),
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 60000}
    })
);

app.listen(3000, function () {
    console.log('Sample merchant listening on port 3000!')
});
