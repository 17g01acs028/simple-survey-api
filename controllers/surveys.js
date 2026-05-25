import { prisma } from '../prisma/client/index.js';
import xml2js from 'xml2js';

// Get all surveys
export const getSurveys = async (req, res) => {
  try {
    const surveys = await prisma.survey.findMany({
      include: {
        responses: true,
      }
    });

    // Build XML response
    const xmlLines = ['<surveys>'];
    for (const survey of surveys) {
      xmlLines.push(`  <survey id="${survey.id}" name="${survey.name}" response_count="${survey.responses.length}">`);
      xmlLines.push(`    <description>${survey.description || ''}</description>`);
      xmlLines.push(`    <created_at>${survey.created_at.toISOString()}</created_at>`);
      xmlLines.push(`  </survey>`);
    }
    xmlLines.push('</surveys>');

    res.set('Content-Type', 'text/xml');
    res.status(200).send(xmlLines.join('\n'));
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Could not fetch surveys' });
  }
};

// Create a new survey
export const addSurvey = async (req, res) => {
  try {
    let name = '';
    let description = '';

    // Check if the body is an XML string
    if (typeof req.body === 'string' && req.body.trim().startsWith('<')) {
      const parsed = await xml2js.parseStringPromise(req.body, { explicitArray: false });
      name = parsed.survey?.name;
      description = parsed.survey?.description;
    } else {
      name = req.body.name;
      description = req.body.description;
    }

    if (!name) {
      return res.status(400).json({ error: 'Survey name is required' });
    }

    const createdSurvey = await prisma.survey.create({
      data: {
        name,
        description,
      },
    });

    const builder = new xml2js.Builder();
    const xml = builder.buildObject({
      result: {
        message: 'Survey created successfully',
        id: createdSurvey.id
      }
    });

    res.set('Content-Type', 'text/xml');
    res.status(201).send(xml);
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ error: 'Error creating the survey' });
  }
};

// Delete an existing survey
export const deleteSurvey = async (req, res) => {
  try {
    const surveyId = parseInt(req.params.id);

    // Delete responses and questions first due to foreign key constraints
    await prisma.response.deleteMany({
      where: { surveyId }
    });

    await prisma.question.deleteMany({
      where: { surveyId }
    });

    // Delete the survey
    await prisma.survey.delete({
      where: { id: surveyId }
    });

    res.status(200).json({ message: 'Survey deleted successfully' });
  } catch (error) {
    console.error('Error deleting survey:', error);
    res.status(500).json({ error: 'Error deleting the survey' });
  }
};
