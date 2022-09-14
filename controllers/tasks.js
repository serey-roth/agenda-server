import { CustomUser, GoogleUser } from "../model/user.js";
import Task from "../model/task.js";
import mongoose from "mongoose";

export const getTasks = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: 'User is not authenticated!'});
    }
    try {
        let tasks;
        if (mongoose.Types.ObjectId.isValid(req.userId)) {
            const custom = await CustomUser.findOne({ _id: req.userId });
            tasks = custom.tasks;
        } else {
            const google = await GoogleUser.findOne({ userId: req.userId });
            tasks = google.tasks;
        }
        res.status(200).json(tasks);
    } catch(error) {
        res.status(404).json({ message: error.message });
    }
}

export const createTask = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: 'User is not authenticated!'});
    }
    const newTask = new Task(req.body);
    try {
        if (mongoose.Types.ObjectId.isValid(req.userId)) {
            const custom = await CustomUser.findOne({ _id: req.userId });
            custom.tasks.push(newTask);
            await custom.save();
        } else {
            const google = await GoogleUser.findOne({ userId: req.userId });
            google.tasks.push(newTask);
            await google.save();
        }
        res.status(201).json(newTask);
    } catch(error) {
        res.status(409).json({ message : error.message });
    }
}

export const deleteTask = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: 'User is not authenticated!'});
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No task with that id');
    }

    try {
        if (mongoose.Types.ObjectId.isValid(req.userId)) {
            const custom = await CustomUser.findOne({ _id: req.userId });
            custom.tasks.pull(id);
            await custom.save();
        } else {
            const google = await GoogleUser.findOne({ userId: req.userId });
            google.tasks.pull(id);
            await google.save();
        }
        await Task.findByIdAndRemove(id);
        res.json({ message : 'Task deleted successfully' });
    } catch(error) {
        res.json({message: error.message})
    }    
}

export const updateTask = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: 'User is not authenticated!'});
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No task with that id');
    }

    try {
        let userUpdated;
        if (mongoose.Types.ObjectId.isValid(req.userId)) {
            userUpdated = await CustomUser.findOneAndUpdate(
                { userId: req.userId, 'tasks._id': id}, 
                {$set: {'tasks.$': req.body}}, 
                {new: true})
        } else {
            userUpdated = await GoogleUser.findOneAndUpdate(
                { userId: req.userId, 'tasks._id': id}, 
                {$set: {'tasks.$': req.body}}, 
                {new: true})
        }
        console.log(userUpdated.tasks)
        const updatedTask = userUpdated.tasks.find(t => t._id.toString() === id);
        res.json(updatedTask);
    } catch(error) {
        res.json({message: error.message})
    } 
}

export const duplicateTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No task with that id');
    }

    try {
        let taskClone;
        if (mongoose.Types.ObjectId.isValid(req.userId)) {
            const custom = await CustomUser.findOne({ _id: req.userId });
            const task = custom.tasks.find(t => t._id == id);
            const obj = task.toObject();
            delete obj._id;
            taskClone = new Task(obj);
            custom.tasks.push(taskClone);
            await custom.save();
        } else {
            const google = await GoogleUser.findOne({ userId: req.userId });
            const task = google.tasks.find(t => t._id == id);
            const obj = task.toObject();
            delete obj._id;
            taskClone = new Task(obj);
            google.tasks.push(taskClone);
            await google.save();
        }
        res.status(202).json(taskClone);
    } catch(error) {
        res.status(404).json({ message: error.message });
    }

}
