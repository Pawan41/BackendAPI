const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// middleware
router.use(express.json());
router.use(express.urlencoded());

const userDataFilePath = path.join(__dirname, '../UserDatabase.json');

// Note :: fs modules has both synchronous and asynchronous method for reading and writing things

// 1. Synchronously Read the data from the file
function readDataFromFile() {
    const data = fs.readFileSync(userDataFilePath);
    return JSON.parse(data); // If the data is in the string format than json.parse return in json format
}

// 2. Synchronously Write the data into the file
function writeDataToFile(data) {
    fs.writeFileSync(userDataFilePath, JSON.stringify(data, null, 2));
}

// Read the Data of all users from the UserDataFilePath
router.get('/users', (req, res) => {
    const usersData = readDataFromFile();
    res.send(usersData);
})

// Read the Data of Single user using the id from the UserDataFilePath
router.get('/users/:id', (req, res) => {
    const usersData = readDataFromFile();
    // Getting the user ID
    const userId = req.params.id;

    const user = usersData.find(user => user.id == userId);

    if (user) {
        res.send(user);
    } else {
        res.send({
            error: 'User not Found...',
        })
    }
})

// Creating the API for creating the user data and store into the storage
router.post('/adduser', (req, res) => {
    const newuser = req.body;
    // console.log(newuser);

    const usersData = readDataFromFile();
    // Writing the Below line is for uniqueness of ID
    newuser.id = new Date().getTime();

    usersData.push(newuser);
    // Save the usersData Data into the dataFile
    writeDataToFile(usersData);

    res.send(newuser);
})

// Updating the User by ID into the Data File
router.put('/updateuser/:id', (req, res) => {
    const updateUser = req.body;
    // console.log('updateUser ', updateUser);

    const usersData = readDataFromFile();
    // Getting the user ID From the URL
    const userId = req.params.id;

    // Find the Index of user(Want to Update...)
    const userIndex = usersData.findIndex(user => user.id == userId);

    if (userIndex == -1) {
        return res.status(404).send({
            error: 'User Not Found!!!!',
        })
    }

    // If user Found
    usersData[userIndex] = {
        ...usersData[userIndex],
        ...updateUser
    }

    writeDataToFile(usersData);
    res.send(usersData[userIndex]);
})

// Creating an API For Deleting the User using the ID
router.delete('/deleteuser/:id', (req, res) => {
    const usersData = readDataFromFile();
    const userId = req.params.id;

    // Find the Index of user(Want to Delete...)
    const userIndex = usersData.findIndex(user => user.id == userId);

    if (userIndex == -1) {
        return res.status(404).send({
            error: 'User Not Found!!!!',
        })
    }

    usersData.splice(userIndex,1);
    writeDataToFile(usersData);

    res.send({
        message: `User with ID ${userId} Deleted Successfully...`
    })
})

router.get('/', (req, res) => {
    res.send({
        message: 'User API Working ......',
    })
})


module.exports = router;