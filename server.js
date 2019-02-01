const express = require('express');

const app = express();
app.use(
    express.json(),
    express.static(__dirname)
);

app.listen(3000, function () {
    console.log('Sample merchant listening on port 3000!')
});
