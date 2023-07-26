const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.use(bodyParser.json());

// Import UserSchema
const User = require('../Models/UserSchema');

/* ----------------MiddleWare------------------ */
// Create The Function To Verifying The Token 
function authenticateToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    const { id } = req.body;
    console.log('token', token);

    if (!token) return res.status(401).json({ message: "Auth Error" });

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
         // If Request Id Exit but Request Id and Decode Id Don't Match
        if (id && decode.id !== id) {
            return res.status(401).json({ message: "Auth Error" });
        }
        // If Request Id and Decode Id Match
        req.id = decode.id;
        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Invalid Token" });
    }
}

// Create An API For User Registration
router.post('/adduser', async (req, res) => {
    try {
        const { name, email, password, age, number } = req.body;

        const checkEmailExit = await User.findOne({ email });

        // If Email Exit Then Return a Message
        if (checkEmailExit) {
            return res.status(409).json({ messgae: 'Email already Exit' });
        }

        // Else Save New User Before Add the New User First Salt and Hash the Password

        // Salt is a piece of random data added to a password before it is hashed and stored
        const salt = await bcrypt.genSalt(10);
        // Hashed Password
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            password: hashPassword,
            email,
            age,
            number
        })

        // Save New User
        await newUser.save();
        res.status(201).json({
            message: "New User Addes Succesfully...."
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Create An API For User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        // If User Not Exit
        if (!existingUser) {
            return res.status(401).json({ messgae: 'Invalid Credentials..' });
        }

        // Compare The Password User Entered with The Database Password
        const isPasswordCorrect = bcrypt.compare(password, existingUser.password);

        // If Password Don't Match 
        if (!isPasswordCorrect) {
            return res.status(401).json({ messgae: 'Invalid Credentials..' });
        }

        // If Password Match Then Simply Create a Token
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        })

        res.status(200).json({
            token,
            message: "User Login Successfully...."
        })

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.get('/getuser', authenticateToken, async (req, res) => {
    const { id } = req.body;
    const user = await User.findById(id);

    // Hiding The Password
    user.password = undefined;
    
    res.status(200).json(user);
})


// Create API For Testing Purpose
router.get('/', (req, res) => {
    res.send({
        message: "User API Working...."
    })
})


module.exports = router;