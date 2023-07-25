const express = require('express');
const cors = require('cors');

const app = express();

// Application Port Number
const port = 8000;


// Import Routes
const userRouter = require('./routes/userRoutes');

/*****   Cors ---> [localhost:3000 localhost:3001] ****/

// const allowedorigins = ['http://localhost:3000','http://localhost:3001'];
// app.use(cors({
//     origin: function(origin,callback){
//         console.log('origin ',origin);
//         if(!origin) return callback(null,true);
//         if(allowedorigins.includes(origin)) return callback(null,true);
//         else {
//             return callback(new Error('Not Allowed by CORS.'))
//         }
//     }
// }));

app.use(cors());

app.use('/api',userRouter);

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'My API Working..........'
    })
})


// Start the server
app.listen(port, () => {
    console.log(`server start at ${port}`)
})
