const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Creating the Instance of express
const app = express();

// Require our DB
require('./Db/conn');

// Import Routes
const todoRoutes = require('./Routes/ToDoRoutes');

// Creating the Port
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

app.use('/todo',todoRoutes);

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Server Started.....'
    })
})

// Start the Server
app.listen(port,()=>{
    console.log(`server start at port ${port}`);
})