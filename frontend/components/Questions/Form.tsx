"use client"

import { Button } from "@/components/ui/button"
import parser from 'xml2js';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FormEvent, useEffect, useState } from "react"
import { toast } from "react-toastify";
import Loading from "./Loading";
import Modal from "./Modal";


export function Questions() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const [isloading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [submiting, setSubmitting] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const { push } = useRouter();

  useEffect(() => {
    // Fetch Questions
    fetch(`${url}/api/questions`)
      .then((response) => response.text())
      .then((xmlData) => {
        // Parse the XML into a JavaScript object
        parser.parseString(xmlData, (err, result) => {
          if (!err) {
            // Access the parsed data, which should be similar to JSON
            setQuestions(result.questions.question);
            setLoading(false);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching or parsing XML:', error);
      });
  }, [url]);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setSubmitting(true);
    e.preventDefault(); // Prevent default form submission
    // Manually handle form submission

    if (validate(currentCard)?.error) {
      toast.error(validate(currentCard)?.error);
    } else {
      const formData = new FormData(e.currentTarget);

      try {
        const response = await axios.put(`${url}/api/questions/response`, formData);
        if (response.status === 201) {
          toast("Data saved successfully.");
          push('/response');
        } else {
          toast("Failed to save data." + response.status);
          setSubmitting(false);
        }
      } catch (err) {
        setSubmitting(false);
        console.log(err);
      }

    }
  };

  const handleNext = () => {
    // Validate and update form data before proceeding to the next card
    // You can use React Hook Form's methods here for validation and data updates.
    if (currentCard < questions.length - 1) {


      if (validate(currentCard)?.error) {
        toast.error(validate(currentCard)?.error);
      } else {
        setCurrentCard(currentCard + 1)

      }

    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  return (
    <form className="flex items-center justify-center" onSubmit={handleFormSubmit}>
      <Card className="w-full sm:w-[70%] lg:w-[60%]  max-h-[calc(100vh-100px)] overflow-auto">
        <CardHeader>
          <CardTitle>Survey</CardTitle>
          <CardDescription>Please answer Every Question corectly and make sure you read instructions</CardDescription>
        </CardHeader>
        <CardContent>

          <div className="grid w-full items-center gap-4">

            <div className="flex flex-col space-y-1.5">
              {isloading ? (<Loading/>) : (<>
                {questions ? (<></>) : (<>We do not have any survey at the moment.</>)}
              {questions && questions.map((question: any, index) => (
                <div key={index}>
                  {question.$.type === 'choice' ? (
                    <Card className={`w-full ${index === currentCard ? "" : "hidden"}`}>
                      <CardHeader>
                        <CardTitle>{question.text}</CardTitle>
                        <CardDescription>{question.description}</CardDescription>
                      </CardHeader>
                      <CardContent>

                        <div className="grid w-full items-center gap-4">

                          <div className="flex flex-col space-y-1.5">


                            {question.options[0].$.multiple === 'no' ? (
                              <div id={`radio_${index}`}>

                                {question.options[0].option.map((option: any, index: any) => (
                                  <div key={index} className="flex justify-between">
                                    <label htmlFor={option.value}>{option._}</label>
                                    <input type="radio" name={question.$.name} value={option.$.value} />

                                  </div>
                                ))}
                              </div>

                            ) : (

                              // Use checkboxes for multiple-choice questions
                              <div id={`check_${index}`}>
                                {question.options[0].option.map((option: any, index: any) => (
                                  <div key={index} className="flex justify-between">
                                    <label htmlFor={option.value}>{option._}</label>

                                    <input
                                      type="checkbox"
                                      id={`data_${index}`}
                                      name={question.$.name}
                                      value={option._}
                                      className="p-4"
                                    />

                                  </div>
                                ))}
                              </div>
                            )}

                          </div>
                        </div>
                      </CardContent>

                    </Card>
                  ) : question.$.type === 'file' ? (
                    // Use an input of type "file" for file upload questions
                    <Card className={`w-full ${index === currentCard ? "" : "hidden"}`}>
                      <CardHeader>
                        <CardTitle>{question.text}</CardTitle>
                        <CardDescription>{question.description}</CardDescription>
                      </CardHeader>
                      <CardContent>

                        <div className="grid w-full items-center gap-4">

                          <div className="flex flex-col space-y-1.5">

                            <Input
                              type="file"
                              id={`data_${index}`}
                              name={question.$.name}
                              required
                              multiple
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className={`w-full ${index === currentCard ? "" : "hidden"}`}>
                      <CardHeader>
                        <CardTitle>{question.text}</CardTitle>
                        <CardDescription>{question.description}</CardDescription>
                      </CardHeader>
                      <CardContent>

                        <div className="grid w-full items-center gap-4">

                          <div className="flex flex-col space-y-1.5">
                            {
                              question.$.type === "short_text" || question.$.type === "email" ? (
                                <Input
                                  type={`${question.$.type === "short_text" ? "text" : question.$.type}`}
                                  id={`data_${index}`}
                                  name={question.$.name}
                                  required
                                />
                              ) : (
                                <Textarea id={`data_${index}`}
                                  name={question.$.name}
                                  required placeholder="Start to type here." />
                              )
                            }

                          </div>
                        </div>
                      </CardContent>
                    </Card>

                  )}

                </div>
              ))}

              </>)}
              
              {/* End of question */}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {questions && currentCard > 0 && <Button variant="outline" disabled={submiting ? true : false} type="button" onClick={handlePrevious}>Previous</Button>}
          {questions && currentCard < questions.length - 1 && <Button disabled={submiting ? true : false} type="button" onClick={handleNext}>Next</Button>}
          {questions && currentCard === questions.length - 1 && <Button disabled={submiting ? true : false}>{submiting ? "Saving please wait....." : "Submit"}</Button>}
        </CardFooter>
      </Card>
      {submiting ? (<Modal message="Submitting Please wait " title="Do not close or Refresh this Window please :-)"/>) : null}
    </form>

  )
}

//validate email 
function validateEmail(email: any) {
  // Define a regular expression pattern for a valid email address
  const emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  // Test the email against the pattern
  return emailPattern.test(email);
}

//this function will be used to validate form
function validate(currentCard: any) {
  const element: any = document.getElementById("data_" + currentCard);
  if (element && element.type === "text") {

    if (element.required) {
      if (element.value === "") {
        return { error: "This field is required" }
      } else {

        return { sucess: "ok Continue" }
      }

    } else {

      return { sucess: "ok Continue" }
    }
  }
  else if (element && element.type === "email") {
    if (element.required) {
      if (element.value === "") {
        return { error: "Please Fill this field" };
      } else {
        if (validateEmail(element.value)) {
          return { sucess: "ok Continue" }
        } else {
          return { error: "Invalid email address" };
        }

      }

    } else {
      return { sucess: "ok Continue" }
    }
  }
  else if (element && element.type === "file") {
    if (element.required) {
      if (!element.files.length) {
        return { error: "Please select at least one file." };
      }

    } else {
      return { sucess: "ok Continue" }
    }
  }

  if (element && element.type === "textarea") {
    if (element.required) {
      if (element.value === "") {
        return { error: "Please Fill this field" };
      } else {
        return { sucess: "ok Continue" }
      }

    } else {
      return { sucess: "ok Continue" }
    }
  }
  //Check if user have selected at least on radio button
  const radioButtonsContainer: any = document.getElementById("radio_" + currentCard);
  if (radioButtonsContainer) {
    const radioButtons = radioButtonsContainer.querySelectorAll('input[type="radio"]');
    let radioSelected = false;

    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        radioSelected = true;
        break; // Exit the loop if a radio button is checked
      }
    }

    if (!radioSelected) {
      return { error: "Please select an option. radio" }; // Display an error message
      // Prevent the form from submitting
    } else {
      return { sucess: "ok Continue" }
    }
  }



  // Radio check ends Here

  //check if atlease on check box is selected
  const checkButtonsContainer: any = document.getElementById("check_" + currentCard);
  if (checkButtonsContainer) {
    const checkButtons = checkButtonsContainer.querySelectorAll('input[type="checkbox"]');
    let checkSelected = false;

    for (const checkButton of checkButtons) {
      if (checkButton.checked) {
        checkSelected = true;
        break; // Exit the loop if a radio button is checked
      }
    }

    if (!checkSelected) {
      return { error: "Please select an option." }; // Display an error message
      // Prevent the form from submitting
    } else {

      return { sucess: "ok Continue" }
    }
  }


  //Check checkbox end
}