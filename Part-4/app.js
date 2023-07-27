const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Creating the Instance of express
const app = express();

// Require our DB
require('./Db/conn');

// Import Routes
const userRoutes = require('./Routes/userRoutes');

// Creating the Port Number
const port = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use('/user',userRoutes);

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Server Started.....'
    })
})

// Start the Server
app.listen(port,()=>{
    console.log(`server start at port ${port}`);
})