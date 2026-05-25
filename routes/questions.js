import express from 'express';
import { getQuestions, addQuestion, getResponse } from '../controllers/questions.js';

const router = express.Router();

// Fetch questions by survey
router.get('/:surveyId', getQuestions);
// Get responses by survey
router.get('/:surveyId/responses', getResponse);

// Insert new Question for a survey
router.post('/:surveyId/new', addQuestion);

export default router;