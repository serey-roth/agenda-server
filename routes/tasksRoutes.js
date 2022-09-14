import { Router } from "express";
import {
    getTasks, 
    createTask, 
    deleteTask, 
    updateTask, 
    duplicateTask
} from '../controllers/tasks.js'
import auth from "../middleware/auth.js";

const router = Router();

router.get('/', auth, getTasks);
router.post('/', auth, createTask);
router.delete('/:id', auth, deleteTask);
router.patch('/:id', auth, updateTask);
router.post('/:id', auth, duplicateTask);

export default router;