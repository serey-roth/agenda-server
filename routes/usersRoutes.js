import { Router } from "express";
import { signIn, signUp, googleSignIn } from '../controllers/users.js'

const router = Router();

router.post('/signIn', signIn);
router.post('/signUp', signUp);
router.post('/googleSignIn', googleSignIn);

export default router;