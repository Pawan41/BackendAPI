const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.DATABASE_CONN_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("DB connected SuccessFully......"))
.catch((err) => console.log(err));