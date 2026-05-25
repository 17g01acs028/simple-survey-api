
import { prisma } from '../prisma/client/index.js';
import xml2js from 'xml2js'
import { v4 as uuidv4 } from 'uuid';

//Retrieve Questions from database
export const getQuestions = async (req, res) => {
  try {
    const surveyId = parseInt(req.params.surveyId);
    const questions = await prisma.question.findMany({
      where: { surveyId },
      orderBy: { order: 'asc' }
    });

  //Create XML 
    const xml = `<questions>
        ${questions.map((question) => `
          <question id="${question.id}" name="${question.name}" type="${question.type}" required="${question.required ? "yes" : "no"}">
            <text>${question.text}</text>
            <description>${question.description ? question.description : ""}</description>
            ${question.type === "choice" && question.frm_options ?
        `<options multiple="${question.frm_options.multiple}">
                ${question.frm_options.values.map((value) => `
                  <option value="${value}">${value}</option>
                `).join("")}
              </options>` : ""}
            ${question.type === "file" && question.filePropertiesId ?
        `<file_properties format=".pdf" max_file_size="1" max_file_size_unit="mb" multiple="yes"/>` : ""}
            ${question.type === "range" && question.frm_options ?
        `<range_properties min="${question.frm_options.min}" max="${question.frm_options.max}" step="${question.frm_options.step}"/>` : ""}
            ${question.type === "rate" && question.frm_options ?
        `<rate_properties max="${question.frm_options.max}"/>` : ""}
          </question>
        `).join("")}
      </questions>`;
      
    // Send the response as XML
    res.set('Content-Type', 'text/xml');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Could not fetch questions' });
  }
}


//Insert question to the database
export const addQuestion = async (req, res) => {
  try {
    const surveyId = parseInt(req.params.surveyId);
    let newQuestion = {};

    // Determine the next order for this question
    const maxOrderQuestion = await prisma.question.findFirst({
      where: { surveyId },
      orderBy: { order: 'desc' }
    });
    const nextOrder = maxOrderQuestion ? maxOrderQuestion.order + 1 : 0;

    // Check if the body is an XML string
    if (typeof req.body === 'string' && req.body.trim().startsWith('<')) {
      const parsed = await xml2js.parseStringPromise(req.body, { explicitArray: false });
      const q = parsed.question;
      
      newQuestion = {
        surveyId,
        order: nextOrder,
        name: q.name,
        type: q.type,
        required: q.required === 'true' || q.required === true,
        text: q.text,
        description: q.description || null,
      };

      if (q.type === 'range' && q.range_properties) {
        newQuestion.frm_options = {
          min: parseFloat(q.range_properties.min),
          max: parseFloat(q.range_properties.max),
          step: parseFloat(q.range_properties.step)
        };
      } else if (q.type === 'rate' && q.rate_properties) {
        newQuestion.frm_options = {
          max: parseFloat(q.rate_properties.max)
        };
      } else if (q.frm_options) {
        newQuestion.frm_options = {
          multiple: q.frm_options.multiple,
          values: q.frm_options.values && q.frm_options.values.value 
            ? (Array.isArray(q.frm_options.values.value) ? q.frm_options.values.value : [q.frm_options.values.value])
            : []
        };
      }

      if (q.file_properties) {
        newQuestion.file_properties = {
          format: q.file_properties.format,
          max_file_size: parseFloat(q.file_properties.max_file_size),
          max_file_size_unit: q.file_properties.max_file_size_unit,
          multiple: q.file_properties.multiple === 'true' || q.file_properties.multiple === 'yes',
        };
      }
    } else {
      // Fallback if it's already a JSON object
      newQuestion = req.body;
      newQuestion.surveyId = surveyId;
    }

    const createData = { ...newQuestion };
    if (createData.file_properties) {
      const fp = createData.file_properties;
      delete createData.file_properties;
      createData.file_properties = {
        create: fp
      };
    }

    // Insert the new question into the database
    const createdQuestion = await prisma.question.create({
      data: createData,
    });

    const builder = new xml2js.Builder();
    const xml = builder.buildObject({
      result: {
        message: 'Question created successfully',
        id: createdQuestion.id
      }
    });

    res.set('Content-Type', 'text/xml');
    res.status(201).send(xml);
  } catch (error) {
    console.log(error);
    const builder = new xml2js.Builder();
    res.set('Content-Type', 'text/xml');
    res.status(500).send(builder.buildObject({ error: 'Error creating the question' }));
  }
}

// Update existing question
export const updateQuestion = async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);
    let updateData = {};

    if (typeof req.body === 'string' && req.body.trim().startsWith('<')) {
      const parsed = await xml2js.parseStringPromise(req.body, { explicitArray: false });
      const q = parsed.question;
      
      updateData = {
        name: q.name,
        type: q.type,
        required: q.required === 'true' || q.required === true,
        text: q.text,
        description: q.description || null,
      };

      if (q.type === 'range' && q.range_properties) {
        updateData.frm_options = {
          min: parseFloat(q.range_properties.min),
          max: parseFloat(q.range_properties.max),
          step: parseFloat(q.range_properties.step)
        };
      } else if (q.type === 'rate' && q.rate_properties) {
        updateData.frm_options = {
          max: parseFloat(q.rate_properties.max)
        };
      } else if (q.frm_options) {
        updateData.frm_options = {
          multiple: q.frm_options.multiple,
          values: q.frm_options.values && q.frm_options.values.value 
            ? (Array.isArray(q.frm_options.values.value) ? q.frm_options.values.value : [q.frm_options.values.value])
            : []
        };
      } else {
        updateData.frm_options = null;
      }
    } else {
      updateData = req.body;
    }

    // We skip updating file_properties for simplicity or just omit it for now
    // If needed we can add nested update logic for file_properties
    
    await prisma.question.update({
      where: { id: questionId },
      data: updateData,
    });

    const builder = new xml2js.Builder();
    const xml = builder.buildObject({
      result: {
        message: 'Question updated successfully',
        id: questionId
      }
    });

    res.set('Content-Type', 'text/xml');
    res.status(200).send(xml);
  } catch (error) {
    console.error(error);
    const builder = new xml2js.Builder();
    res.set('Content-Type', 'text/xml');
    res.status(500).send(builder.buildObject({ error: 'Error updating the question' }));
  }
}

// Delete existing question
export const deleteQuestion = async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);
    
    await prisma.question.delete({
      where: { id: questionId }
    });

    const builder = new xml2js.Builder();
    const xml = builder.buildObject({
      result: {
        message: 'Question deleted successfully',
        id: questionId
      }
    });

    res.set('Content-Type', 'text/xml');
    res.status(200).send(xml);
  } catch (error) {
    console.error(error);
    const builder = new xml2js.Builder();
    res.set('Content-Type', 'text/xml');
    res.status(500).send(builder.buildObject({ error: 'Error deleting the question' }));
  }
}

//Insert new response to the database
export const addResponse = async (req, res) => {
  try {
    const surveyId = parseInt(req.params.surveyId);
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;

    // Check if a response for this survey and IP already exists
    const existingResponse = await prisma.response.findFirst({
      where: {
        surveyId,
        ipAddress
      }
    });

    if (existingResponse) {
      return res.status(403).json({ error: 'You have already submitted a response for this survey.' });
    }

    let response = req.body;
    let files;
    console.log(response);
    if (req.files) {
      const file = req.files
      // Create an object to group files by fieldname
      files = file.reduce((acc, file) => {
        if (!acc[file.fieldname]) {
          acc[file.fieldname] = [];
        }
        acc[file.fieldname].push(file.originalname);
        return acc;
      }, {});
    }

    // Merge the files into the body
    response = { ...response, ...files };

    const sessionId = uuidv4(); // This generates a random UUID
    console.log(response);

    function stringifyArrays(obj) {
      for (const key in obj) {
        if (Array.isArray(obj[key])) {
          // Stringify the array
          obj[key] = JSON.stringify(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          // If the value is an object, recursively call the function
          stringifyArrays(obj[key]);
        } else {
          // Convert non-array values to strings
          obj[key] = String(obj[key]);
        }
      }
    }

    stringifyArrays(response);

    // Iterate through the response data and save it to the database
    for (const [question, answer] of Object.entries(response)) {
      await prisma.response.create({
        data: {
          surveyId,
          sessionId,
          question,
          response: answer,
          ipAddress
        },
      });
    }
    // Create an XML builder
    const builder = new xml2js.Builder();
    const xml = builder.buildObject({
      question_response: response,
    });

    //Send response in XML format

    res.set('Content-Type', 'text/xml');
    res.status(201).send(xml);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while submitting the response.' });
  }
}


//Retrieve responses from database (filter and paginate)
export const getResponse = async (req, res) => {
  try {
    const surveyId = parseInt(req.params.surveyId);
    //Create variables
    const email = req.query.email || "";
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const currentPage = parseInt(req.query.page, 10) || 1;

    // Retrieve all responses from the database
    const responses = await prisma.response.findMany({
      where: { surveyId }
    });


    if (responses.length === 0) {
      // No responses found
      return res.status(404).json({ message: 'No responses found' });
    }


    // Group responses by sessionId
    let groupedResponses = new Map();
    responses.forEach((response) => {
      const sessionId = response.sessionId;
      if (!groupedResponses.has(sessionId)) {
        groupedResponses.set(sessionId, []);
      }
      groupedResponses.get(sessionId).push(response);
    });
    //Retain copy of original response from database(All Responses from db)
    const original = groupedResponses;

    //Create a copy of filtered and Paginated data
    groupedResponses = filterAndPaginate(groupedResponses, email, currentPage, pageSize);

    // Generate the XML structure for question_responses
    const xmlLines = [
      `<question_responses current_page="${currentPage}" last_page="${Math.ceil(original.size / pageSize)}" page_size="${pageSize}" total_count="${original.size}">`,
    ];

    for (const [sessionId, sessionResponses] of groupedResponses) {
      // Generate question_response for each sessionId
      xmlLines.push('<question_response>');
      xmlLines.push(`<response_id>${sessionId}</response_id>`);

      // Include dynamic fields
      sessionResponses.forEach((response) => {
        const question = response.question;
        const responseValue = response.response;

        // Include question as the tag and response as the value
        xmlLines.push(`<${question}>${question === "certificates" ? cert(responseValue) : responseValue}</${question}>`);
      });

      function cert(obj) {
        const objx = JSON.parse(obj)
        let string = "";
        objx.forEach((element) => {
          string += `<certificate>${element}</certificate>`
        })
        return string;
      }
      // Close question_response
      xmlLines.push('</question_response>');
    }

    // Close question_responses
    xmlLines.push('</question_responses>');

    // Join the XML lines into a single string
    const responseXml = xmlLines.join('\n');

    res.type('application/xml').send(responseXml);
  } catch (error) {
    console.error('Error retrieving responses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

//Function to filter data
function filterAndPaginate(data, filterByEmail, pageNumber, itemsPerPage) {

  //Creat a new Map for filter
  const filteredDataMap = new Map();

  // Calculate the start index for pagination
  const startIndex = (pageNumber - 1) * itemsPerPage;

  // Loop through the original data Map
 
// Loop through the original data Map
for (const [sessionId, sessionData] of data) {
  // If no email filter is provided or a partial email match is found
  if (!filterByEmail || sessionData.some(entry => entry.question === 'email_address' && isPartialMatch(filterByEmail, entry.response))) {
    // Include the whole session data in the filtered map
    filteredDataMap.set(sessionId, sessionData);
  }
}


  // Convert the filtered map to an array for pagination
  const filteredDataArray = Array.from(filteredDataMap);

  // Perform pagination
  const paginatedData = filteredDataArray.slice(startIndex, startIndex + itemsPerPage);

  // Convert the paginated array back to a Map
  const paginatedDataMap = new Map(paginatedData);

  //return filtered and Paginated Data
  return paginatedDataMap;
}

function isPartialMatch(partial, full) {
  return full.includes(partial);
}

// Reorder questions
export const reorderQuestions = async (req, res) => {
  try {
    const questionsToUpdate = req.body;

    if (!Array.isArray(questionsToUpdate)) {
      return res.status(400).json({ error: 'Expected an array of question orders' });
    }

    const updatePromises = questionsToUpdate.map(q => {
      return prisma.question.update({
        where: { id: parseInt(q.id) },
        data: { order: parseInt(q.order) }
      });
    });

    await prisma.$transaction(updatePromises);

    res.status(200).json({ message: 'Questions reordered successfully' });
  } catch (error) {
    console.error('Error reordering questions:', error);
    res.status(500).json({ error: 'Error reordering questions' });
  }
}