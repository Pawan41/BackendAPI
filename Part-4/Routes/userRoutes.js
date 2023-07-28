const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.use(bodyParser.json());
router.use(cookieParser());

// Import UserSchema
const User = require('../Models/UserSchema');

/* ----------------MiddleWare------------------ */
// Create The Function To Verifying The Token 
function authenticateToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    const { id } = req.body;

    if (!token) return res.status(401).json({ message: "Token Not Found" });

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // If Request Id Exits but Request Id and Decode Id Don't Match
        if (id && decode.id !== id) {
            return res.status(401).json({ message: "Invalid Token" });
        }
        // If Request Id and Decode Id Match
        req.id = decode.id;
        next();
    } catch (err) {
        next(err);
    }
}

// Create An API For User Registration
router.post('/adduser', async (req, res, next) => {
    try {
        const { name, email, password, age, number,gender } = req.body;

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
            number,
            gender
        })

        // Save New User Into the DataBase
        await newUser.save();
        res.status(201).json({
            message: "New User Added Succesfully...."
        })
    } catch (err) {
        next(err);
    }
})

// Create An API For User Login
router.post('/login', async (req, res, next) => {
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

        // If Password Match 

        // Then Simply Generate Access Token
        const accesstoken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1hr',
        })

        // Also Generate Refresh Token For More Security Purpose and Store it into the DataBase
        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.JWT_REFRESH_SECRET_KEY);
        existingUser.refreshToken = refreshToken;
        await existingUser.save();

        // Save The Refresh Token Into The Cookies
        res.cookie('refreshToken', refreshToken, { httpOnly: true, path: '/refresh_token' });

        res.status(200).json({
            accesstoken,
            refreshToken,
            message: "User Login Successfully...."
        })

    } catch (err) {
        next(err);
    }
})

// Create An API to Get The User (Who are Authorized)
router.get('/getuser', authenticateToken, async (req, res) => {
    const { id } = req.body;
    const user = await User.findById(id);

    // Hiding The Password and Refresh Token
    user.password = undefined;
    user.refreshToken =undefined;
    res.status(200).json(user);
})

// Creating API To Generate New Access Token If the  Refresh Token is There (without Login the User Again)
router.get('/refresh_token', async (req, res, next) => {
    // Get RefreshToken From The Cookie
    const reftoken = req.cookies.refreshToken;
    // console.log('reftoken',reftoken);

    // If Refresh Token Not Found
    if(!reftoken) return res.status(401).json({ message: "Token Not Found" });

    // Refresh Token Found
    jwt.verify(reftoken, process.env.JWT_REFRESH_SECRET_KEY,async(err,decode)=>{
        if(err){
            const error =new Error('Invalid Token');
            next(error);
        }
        const id=decode.id;
        const existingUser= await User.findById(id);

        if(existingUser || reftoken !==existingUser.refreshToken){
            const error =new Error('Invalid Token');
            next(error);
        }

        // Generate Access Token
        const accesstoken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1hr',
        })

        // Also Generate Refresh Token and Store it into the DataBase
        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.JWT_REFRESH_SECRET_KEY);
        existingUser.refreshToken = refreshToken;
        await existingUser.save();

        // Save The Refresh Token Into The Cookies
        res.cookie('refreshToken', refreshToken, { httpOnly: true, path: '/refresh_token' });

        res.status(200).json({
            accesstoken,
            refreshToken,
            message: "Fresh Token Generated Successfully...."
        })
    })
})

/* -----------Error Handling Midlleware--------- */
router.use((err, req, res, next) => {
    console.log('Error Middleware Calling....', err)
    res.status(500).json({ message: err.message });
})

module.exports = router;