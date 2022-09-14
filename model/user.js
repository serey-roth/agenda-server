import mongoose from 'mongoose'
import { taskSchema } from './task.js'

const customSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    projects: {
        type: [ String ],
        default: ['Inbox']
    },
    tasks: [ taskSchema ],
})

const googleSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    userId: String,
    projects: {
        type: [ String ],
        default: ['Inbox']
    },
    tasks: [ taskSchema ],
})

export const CustomUser = mongoose.model('Custom', customSchema, 'users');
export const GoogleUser = mongoose.model('Google', googleSchema, 'users');
