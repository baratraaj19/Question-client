import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Toaster, toast } from "sonner" // Import Toaster and toast
import QuestionCard from "@/components/form-editor/question-card" // Adjust import path if necessary

const FormBuilderPage = () => {
  const navigate = useNavigate()

  const [questionCards, setQuestionCards] = useState([{ id: 1, data: {} }])
  const [nextQuestionId, setNextQuestionId] = useState(2)

  const handleAddQuestion = () => {
    setQuestionCards([...questionCards, { id: nextQuestionId, data: {} }])
    setNextQuestionId(nextQuestionId + 1)
    toast.success("Question added successfully!")
  }

  const handleRemoveQuestion = (id) => {
    setQuestionCards(questionCards.filter((card) => card.id !== id))
    toast.info("Question removed.")
  }

  const handleQuestionDataChange = (id, data) => {
    const updatedCards = questionCards.map((card) =>
      card.id === id ? { ...card, data } : card
    )
    setQuestionCards(updatedCards)
  }

  const handleSave = async () => {
    // Validate that no question has null or incomplete data
    const incompleteQuestion = questionCards.some((card) => {
      const { data } = card
      return !data.title || !data.questionType || !data.points // Customize this condition based on required fields
    })

    if (incompleteQuestion) {
      toast.error(
        "All questions must be filled out. Please provide valid data for each question."
      )
      return // Prevent submission if validation fails
    }

    try {
      const payload = {
        questions: questionCards.map((card, index) => ({
          questionId: card.id || index + 1,
          title: card.data.title,
          questionType: card.data.questionType || "None",
          mediaType: card.data.mediaType || "None",
          points: card.data.points || 0,
          picture: card.data.picture || "",
          description: card.data.description || "",
          categorizeData: card.data.categorizeData || {
            categories: [],
            items: [],
          },
          clozeData: card.data.clozeData || {
            sentence: [],
            options: [],
            feedback: [],
          },
          compData: card.data.compData || [],
          answers: card.data.answers || [],
        })),
      }

      console.log("Payload to be sent:", payload)

      const response = await fetch("http://localhost:3000/api/save-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success("Questions saved successfully!")
      } else {
        const errorData = await response.json()
        console.error("Save failed:", errorData)
        toast.error("Failed to save questions.")
      }
    } catch (error) {
      console.error("Error saving questions:", error)
      toast.error("An error occurred while saving questions.")
    }
  }

  const handleNavigate = () => {
    // Optionally reset any state if needed
    setQuestionCards([{ id: 1, data: {} }]) // Resetting the state to initial form state
    setNextQuestionId(2) // Reset next question ID to 2 (or keep the same if needed)

    // Navigate to the '/view' page
    navigate("/view")

    // Optionally, force a full page reload if required
    window.location.reload()
    toast.success("Navigated to view page.")
  }

  const handleCancel = () => {
    setQuestionCards([{ id: 1, data: {} }])
    setNextQuestionId(2)
    toast.info("Form reset to default.")
  }

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Add Toaster for global toast rendering */}
      <Toaster position='bottom-right' richColors />

      {/* Navbar */}
      <header className='bg-gray-800 text-white py-4 shadow-md'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-xl font-bold'>Question Management</h1>
          <div className='space-x-4'>
            <button
              onClick={handleAddQuestion}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'>
              Add Question
            </button>
            <button
              onClick={handleSave}
              className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md'>
              Save
            </button>
            <button
              onClick={handleCancel}
              className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md'>
              Cancel
            </button>
            <button
              onClick={handleNavigate}
              className='bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md'>
              Finish
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='w-3/4 flex-grow container mx-auto py-6 space-y-6'>
        {questionCards.map((card, index) => (
          <div
            key={card.id}
            className='relative border rounded-lg p-4 shadow-md'>
            {/* Question Number */}
            <h2 className='absolute -top-3 -left-3 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center'>
              {index + 1}
            </h2>
            {/* Remove Button */}
            <button
              onClick={() => handleRemoveQuestion(card.id)}
              className='absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center pb-1'>
              &times;
            </button>
            <QuestionCard
              questionId={card.id}
              onDataChange={(data) => handleQuestionDataChange(card.id, data)}
            />
          </div>
        ))}
      </main>
    </div>
  )
}

export default FormBuilderPage
