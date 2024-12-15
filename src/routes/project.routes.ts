import express from 'express';

import { authenticateUser } from '../middleware/authenticateUser.js';
import { createProjectPost, getAllProjectPost, getByIdProjectPost, getProjectPost } from '../controller/project.controller.js';


const router = express.Router();



router.post('/create-project',authenticateUser,createProjectPost)
router.get('/get-project/:userId',getProjectPost)
router.get('/getall-project',getAllProjectPost)
router.get('/get-project-byid/:postId',getByIdProjectPost)
export default router