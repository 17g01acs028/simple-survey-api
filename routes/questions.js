import express from 'express';
import { getQuestions, addQuestion, getResponse, updateQuestion, deleteQuestion, reorderQuestions } from '../controllers/questions.js';

const router = express.Router();

// Reorder questions
router.put('/reorder', reorderQuestions);

// Fetch questions by survey
router.get('/:surveyId', getQuestions);
// Get responses by survey
router.get('/:surveyId/responses', getResponse);

// Insert new Question for a survey
router.post('/:surveyId/new', addQuestion);

// Update existing question
router.put('/update/:questionId', updateQuestion);

// Delete existing question
router.delete('/delete/:questionId', deleteQuestion);

export default router;