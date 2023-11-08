
import { prisma } from '../prisma/client/index.js';
import xml2js from 'xml2js'
import { v4 as uuidv4 } from 'uuid';

//Retrieve Questions from database
export const getQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany();

  //Create XML 
    const xml = `<questions>
        ${questions.map((question) => `
          <question name="${question.name}" type="${question.type}" required="${question.required ? "yes" : "no"}">
            <text>${question.text}</text>
            <description>${question.description ? question.description : ""}</description>
            ${question.type === "choice" ?
        `<options multiple="${question.frm_options.multiple}">
                ${question.frm_options.values.map((value) => `
                  <option value="${value}">${value}</option>
                `).join("")}
              </options>` : ""}
            ${question.type === "file" && question.filePropertiesId ?
        `<file_properties format=".pdf" max_file_size="1" max_file_size_unit="mb" multiple="yes"/>` : ""}
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
  const newQuestion = req.body;

  try {
    // Insert the new question into the database
    const createdQuestion = await prisma.question.create({
      data: {
        ...newQuestion,
        file_properties: {
          create: newQuestion.file_properties,
        }
      },
    });

    res.status(201).json({ message: 'Question created successfully', createdQuestion });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating the question' });

  }
}

//Insert new response to the database
export const addResponse = async (req, res) => {
  try {
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
          sessionId,
          question,
          response: answer,
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
    //Create variables
    const email = req.query.email || "";
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const currentPage = parseInt(req.query.page, 10) || 1;

    // Retrieve all responses from the database
    const responses = await prisma.response.findMany();


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