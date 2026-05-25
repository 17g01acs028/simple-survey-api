import express from 'express';
import { getSurveys, addSurvey, deleteSurvey } from '../controllers/surveys.js';

const router = express.Router();

router.get('/', getSurveys);
router.post('/new', addSurvey);
router.delete('/delete/:id', deleteSurvey);

export default router;
