import express, { Router } from 'express';
import { registerUser, loginUser } from '../controllers/users';

const userRouter: Router = express.Router();

userRouter.post('/users', registerUser);
userRouter.post('/auth/login', loginUser);

export default userRouter;