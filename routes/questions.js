
import express from 'express';
import { getQuestions, addQuestion, getResponse } from '../controllers/questions.js';

const router = express.Router();

// Fetch all questions
router.get('/', getQuestions);
router.get("/responses",getResponse);

//Insert new Question
router.post('/new', addQuestion);


export default router;