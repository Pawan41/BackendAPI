const express = require('express');
const router = express.Router();

// Import The ToDoSchema
const ToDo = require('../Models/TodoTask');

// Creating An API For Create The ToDo
router.post('/addtodo',async (req,res)=>{
    const {task,completed} =req.body;
    const todo =new ToDo({
        task,
        completed
    })

    const saveToDo = await todo.save();
    res.json({
        message:"ToDo Saved Succesfully...",
        saveToDo: saveToDo
    })
    
})

// Creating An API For Fetching the All ToDo Lists
router.get('/getalltodo',async (req,res)=>{
    const getAllTodo = await ToDo.find();
    res.json(getAllTodo);
})

module.exports = router;