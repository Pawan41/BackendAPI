const mongoose = require('mongoose')

// Create a ToDoSchema
const todoTaskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    completed:{
        type:Boolean,
        dafault:false,
    }

})

const ToDoTask = mongoose.model('ToDoTask',todoTaskSchema);

module.exports = ToDoTask;