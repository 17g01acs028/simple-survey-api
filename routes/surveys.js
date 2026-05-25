import express from 'express';
import { getSurveys, addSurvey } from '../controllers/surveys.js';

const router = express.Router();

router.get('/', getSurveys);
router.post('/new', addSurvey);

export default router;
