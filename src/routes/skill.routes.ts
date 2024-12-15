import express from 'express';

import { authenticateUser } from '../middleware/authenticateUser.js';
import { createUserInfoSkill,getUserInfoSkills, updateUserInfoSkill } from '../controller/skill.controller.js';


const router = express.Router();



router.post('/create-skill',authenticateUser,createUserInfoSkill)
router.get('/get-skill/:userId',getUserInfoSkills)
router.put("/update-skill/:id",authenticateUser,updateUserInfoSkill)

export default router