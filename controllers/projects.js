import { CustomUser, GoogleUser } from "../model/user.js";
import mongoose from "mongoose";

export const getCurrentProject = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: 'User is not authenticated!'});
    }
    const { title, sortBy } = req.params;
    try {
        let tasks;
        if (mongoose.Types.ObjectId.isValid(req.userId)) {
            const custom = await CustomUser.findOne({ _id: req.userId });
            tasks = custom.tasks;
        } else {
            const google = await GoogleUser.findOne({ userId: req.userId });
            tasks = google.tasks;
        }
        const project = {
            name: title,
            'to do': [],
            'in progress': [],
            'completed': [],
        };
        for (const task of tasks) {
            if (task.project === title) {
                project[task.completeStatus].push(task);
            }
        }
        if (sortBy !== 'none') {
            project['to do'].sort(sortTasks(sortBy));
            project['in progress'].sort(sortTasks(sortBy));
            project['completed'].sort(sortTasks(sortBy));
        }
        res.status(200).json(project);
    } catch(error) {
        res.status(404).json({ message: error.message });
    }
}

export const getProjectNames = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: 'User is not authenticated!'});
    }
    try {
        let projectNames;
        if (mongoose.Types.ObjectId.isValid(req.userId)) {
            const custom = await CustomUser.findOne({ _id: req.userId });
            projectNames = custom.projects;
        } else {
            const google = await GoogleUser.findOne({ userId: req.userId });
            projectNames = google.projects;
        }
        res.status(200).json(projectNames);
    } catch(error) {
        res.status(404).json({ message: error.message });
    }
}

export const addProject = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: 'User is not authenticated!'});
    }
    const {project} = req.body;
    try {
        if (mongoose.Types.ObjectId.isValid(req.userId)) {
            const custom = await CustomUser.findOne({ _id: req.userId });
            if (custom.projects.includes(project)) {
                return res.json({message: 'Project already exists'});
            } else {
                custom.projects.push(project);
                await custom.save();
                res.status(201).json({project});
            }
        } else {
            const google = await GoogleUser.findOne({ userId: req.userId });
            if (google.projects.includes(project)) {
                return res.json({message: 'Project already exists'});
            } else {
                google.projects.push(project);
                await google.save();
                res.status(201).json({project});
            }
        }
    } catch(error) {
        res.status(409).json({ message: error.message });
    }
}

const sortTasks = (sortBy) => {
    switch(sortBy) {
        case 'priority': {
            return (t1, t2) => {
                const v1 = Number.parseInt(t1.priority);
                const v2 = Number.parseInt(t2.priority);
                return v1 < v2 ? -1 : (v1 === v2 ? 0 : 1)
            }
        }
        default: {
            return (t1, t2) => {
                if (t1.end === '' && t2.end === '') {
                    return 0;
                } else if (t1.end === '') {
                    return -1;
                } else if (t2.end === '') {
                    return 1;
                } else {
                    const d1 = new Date(t1.end).getTime();
                    const d2 = new Date(t2.end).getTime();
                    return d1 < d2 ? -1 : (d1 === d2 ? 0 : 1);
                }
            }
        } 
    }
}
