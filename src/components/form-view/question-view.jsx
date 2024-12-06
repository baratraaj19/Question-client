import React, { useState, useEffect } from "react"
import CategorizeView from "@/components/form-view/categorize-view"
import ClozeView from "@/components/form-view/cloze-view"
import CompView from "@/components/form-view/comp-view"
import axios from "axios"

const DynamicQuestionView = ({ questions }) => {
  const [answers, setAnswers] = useState([]) // Track all answers globally
  const [updatedQuestions, setUpdatedQuestions] = useState([]) // Initialize with empty array

  useEffect(() => {
    console.log("Received questions:", questions) // Debugging: Log the incoming questions
    if (questions && questions.length > 0) {
      setUpdatedQuestions(questions)
    } else {
      setUpdatedQuestions([]) // Ensure it's empty if no questions are provided
    }
  }, [questions]) // Re-run when `questions` changes

  // Utility function to validate and format base64 image data
  const getImageSrc = (picture) => {
    if (picture.startsWith("data:image/")) {
      return picture // Already a valid base64 data URI
    }
    return `data:image/jpeg;base64,${picture}` // Default to JPEG
  }

  // Ensure answers are correctly added to updatedQuestions before submitting
  useEffect(() => {
    if (answers.length > 0) {
      const updatedQuestionsWithAnswers = updatedQuestions.map(
        (question, index) => {
          const questionAnswers = answers.filter(
            (answer) => answer.questionIndex === index
          )
          return {
            ...question,
            answers: questionAnswers,
          }
        }
      )

      // Only update the state if the answers have actually changed
      if (
        JSON.stringify(updatedQuestionsWithAnswers) !==
        JSON.stringify(updatedQuestions)
      ) {
        setUpdatedQuestions(updatedQuestionsWithAnswers)
      }
    }
  }, [answers, updatedQuestions]) // Make sure to re-run when either `answers` or `updatedQuestions` changes

  // Submit the answers to the backend
  const submitAnswers = async () => {
    try {
      const updates = updatedQuestions.map((question) => ({
        questionId: question.questionId,
        answers: question.answers.map((answer) => {
          if (
            answer.categoryAnswer &&
            typeof answer.categoryAnswer === "object"
          ) {
            return {
              ...answer,
              categoryAnswer: JSON.stringify(answer.categoryAnswer),
            }
          }
          return answer
        }),
      }))

      const response = await axios.patch(
        "http://localhost:3000/api/questions", // Replace with your backend URL
        updates // Payload: array of { questionId, answers }
      )

      console.log("Answers updated successfully:", response.data)
    } catch (error) {
      console.error("Error updating answers:", error)
    }
  }

  // Handle Categorization Answer Change
  const handleCategorizationAnswerChange = (newPlacements, questionIndex) => {
    const categoryAnswer = Object.keys(newPlacements).reduce(
      (acc, category) => {
        acc[category] = newPlacements[category] || []
        return acc
      },
      {}
    )

    setAnswers((prevAnswers) => [
      ...prevAnswers.filter((answer) => answer.questionIndex !== questionIndex),
      { categoryAnswer, questionIndex, questionType: "Categorize" },
    ])
  }

  // Handle Cloze Answer Change
  const handleClozeAnswerChange = (newAnswers, questionIndex) => {
    setAnswers((prevAnswers) => [
      ...prevAnswers.filter((answer) => answer.questionIndex !== questionIndex),
      ...newAnswers.map((answer) => ({
        ...answer,
        questionIndex,
        questionType: "Cloze",
      })),
    ])
  }

  // Handle Comprehension Answer Change
  const handleCompAnswerChange = (selectedOptions, questionIndex) => {
    setAnswers((prevAnswers) => [
      ...prevAnswers.filter((answer) => answer.questionIndex !== questionIndex),
      ...selectedOptions.map((option) => ({
        questionIndex,
        optionChosen: option.optionChosen,
        questionType: "Comprehension",
      })),
    ])
  }

  return (
    <div className='p-6'>
      {updatedQuestions && updatedQuestions.length > 0 ? (
        updatedQuestions.map((question, index) => {
          const {
            questionType,
            mediaType,
            points,
            title,
            description,
            categorizeData,
            clozeData,
            compData,
            picture, // Assume this contains base64-encoded image data from DB
          } = question

          return (
            <div
              key={`question-${index}`}
              className='border rounded-lg shadow-md p-4 mb-4 bg-white'>
              <div className='flex flex-col justify-between mb-4'>
                <div className='flex justify-between'>
                  <h3 className='font-semibold text-sm w-[90%]'>
                    Question {index + 1}
                  </h3>
                  <h3 className='font-semibold text-sm'>
                    {points && `${points} points`}
                  </h3>
                </div>
                <p className='text-lg font-semibold mt-2'>{title}</p>
                <p className='text-sm text-gray-600 text-justify'>
                  {description}
                </p>
              </div>

              {mediaType === "Image" && picture && (
                <div className='flex justify-center items-center'>
                  <img
                    src={getImageSrc(picture)} // Decode the base64 image
                    alt='Question media'
                    className='mb-4 w-auto h-40'
                  />
                </div>
              )}

              {questionType === "Categorize" && categorizeData && (
                <CategorizeView
                  categorizeData={categorizeData}
                  onCategorizationChange={(newPlacements) =>
                    handleCategorizationAnswerChange(newPlacements, index)
                  }
                />
              )}
              {questionType === "Cloze" && clozeData && (
                <ClozeView
                  clozeData={clozeData}
                  onAnswerChange={(newAnswers) =>
                    handleClozeAnswerChange(newAnswers, index)
                  }
                />
              )}
              {questionType === "Comprehension" && compData && (
                <CompView
                  compData={compData}
                  onAnswerChange={(selectedOptions) =>
                    handleCompAnswerChange(selectedOptions, index)
                  }
                />
              )}
            </div>
          )
        })
      ) : (
        <p>No questions available</p>
      )}

      <button
        onClick={submitAnswers}
        className='bg-blue-500 text-white py-2 px-4 rounded'>
        Submit Answers
      </button>
    </div>
  )
}

export default DynamicQuestionView
