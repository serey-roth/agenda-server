import { Router } from "express"
import { 
    addProject,
    getCurrentProject,
    getProjectNames, 
} from '../controllers/projects.js'
import auth from "../middleware/auth.js";

const router = Router();

router.get('/:title/:sortBy', auth, getCurrentProject);
router.get('/', auth, getProjectNames);
router.post('/', auth, addProject);

export default router;