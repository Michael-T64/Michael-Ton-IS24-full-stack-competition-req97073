const express = require('express');
const productEndpoints = require('./endpoints/products');

// There will not be a true server for this project but I will mimic having one for the purposes of demonstrating clean file structure and naming conventions

// Main app
const app = express();

//middleware
app.use(express.json());

//assign all endpoints to /api
app.use('/api/product', productEndpoints);

// NOTE: normally I would store credentials and ports etc in a seperate .env file
app.listen(4000, () => {
    console.log('listening on port 4000');
});
