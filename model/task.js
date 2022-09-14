import mongoose from "mongoose";

export const taskSchema = mongoose.Schema({
    title: String, 
    description: String, 
    priority: String,
    project: String,
    start: String,
    end: String,
    allDay: Boolean,
    specificEndDate: String,
    isCompleted: {
        type: Boolean,
        default: false,
    },
    completeStatus: {
        type: String,
        default: 'to do'
    }
})

const Task = mongoose.model('Task', taskSchema);

export default Task;