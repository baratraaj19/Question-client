// // export default QuestionCard;
// import React, { useState, useEffect } from "react"
// import {
//   Select,
//   SelectItem,
//   SelectTrigger,
//   SelectContent,
// } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Card } from "@/components/ui/card"
// import Categorize from "./catogorize"
// import Cloze from "./cloze"
// import Comprehension from "./comprehension"

// const QuestionCard = ({ questionId, onDataChange }) => {
//   const [questionData, setQuestionData] = useState({
//     id: questionId, // Include the unique ID
//     questionType: "None",
//     mediaType: "None",
//     points: "",
//     title: "",
//     picture: "",
//     description: "",
//     categorizeData: { categories: [], items: [] },
//     clozeData: { sentence: [], options: [], feedback: [] },
//     compData: [],
//     answers: [],
//   })

//   // Sync questionData with the parent component
//   useEffect(() => {
//     onDataChange(questionData)
//   }, [questionData])

//   // Handlers to update questionData
//   const handleChange = (field, value) => {
//     setQuestionData((prev) => ({ ...prev, [field]: value }))
//   }

//   return (
//     <Card className='w-full p-6'>
//       <h2 className='text-xl font-bold mb-4'>Question {questionId}</h2>

//       {/* Question Type Dropdown */}
//       <div className='flex justify-evenly mb-4 gap-5'>
//         <div className='w-1/3'>
//           <Label className='block text-sm font-medium text-gray-700'>
//             Question Type
//           </Label>
//           <Select
//             value={questionData.questionType}
//             onValueChange={(value) => handleChange("questionType", value)}>
//             <SelectTrigger className='mt-1 w-full p-2 border border-gray-300 rounded-md'>
//               {questionData.questionType}
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value='Categorize'>Categorize</SelectItem>
//               <SelectItem value='Cloze'>Cloze</SelectItem>
//               <SelectItem value='Comprehension'>Comprehension</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className='w-1/3'>
//           <Label className='block text-sm font-medium text-gray-700'>
//             Media Type
//           </Label>
//           <Select
//             value={questionData.mediaType}
//             onValueChange={(value) => handleChange("mediaType", value)}>
//             <SelectTrigger className='mt-1 w-full p-2 border border-gray-300 rounded-md'>
//               {questionData.mediaType}
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value='None'>None</SelectItem>
//               <SelectItem value='Image'>Image</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Points Input */}
//         <div className='w-1/3'>
//           <Label
//             htmlFor='points'
//             className='block text-sm font-medium text-gray-700'>
//             Points
//           </Label>
//           <Input
//             id='points'
//             type='number'
//             value={questionData.points}
//             onChange={(e) => handleChange("points", e.target.value)}
//             className='mt-1 w-full p-2 border border-gray-300 rounded-md'
//           />
//         </div>
//       </div>

//       {questionData.mediaType === "Image" && (
//         <div className='mb-4'>
//           <Label
//             htmlFor='picture'
//             className='block text-sm font-medium text-gray-700'>
//             Upload Image here
//           </Label>
//           <Input
//             id='picture'
//             type='file'
//             value={questionData.picture}
//             onChange={(e) => handleChange("picture", e.target.value)}
//             className='mt-1 w-full p-2 border border-gray-300 rounded-md'
//           />
//         </div>
//       )}

//       {/* Title Input */}
//       <div className='mb-4'>
//         <Label
//           htmlFor='title'
//           className='block text-sm font-medium text-gray-700'>
//           Title
//         </Label>
//         <Input
//           id='title'
//           value={questionData.title}
//           onChange={(e) => handleChange("title", e.target.value)}
//           className='mt-1 w-full p-2 border border-gray-300 rounded-md'
//           placeholder='Enter the Title here...'
//         />
//       </div>

//       {/* Description Input */}
//       <div className='mb-4'>
//         <Label
//           htmlFor='description'
//           className='block text-sm font-medium text-gray-700'>
//           {questionData.questionType === "Comprehension"
//             ? `Comprehension Passage`
//             : `Description`}
//         </Label>
//         <Textarea
//           id='description'
//           rows='4'
//           value={questionData.description}
//           onChange={(e) => handleChange("description", e.target.value)}
//           className='mt-1 w-full p-2 border border-gray-300 rounded-md'
//           placeholder='Enter the question description here...'></Textarea>
//       </div>

//       {/* Dynamic Component Based on Question Type */}
//       {questionData.questionType === "Categorize" ? (
//         <Categorize
//           onCategorizeChange={(data) => handleChange("categorizeData", data)}
//         />
//       ) : questionData.questionType === "Cloze" ? (
//         <Cloze onClozeChange={(data) => handleChange("clozeData", data)} />
//       ) : questionData.questionType === "Comprehension" ? (
//         <Comprehension
//           onCompChange={(data) => handleChange("compData", data)}
//         />
//       ) : (
//         <div className='text-center'>Choose a question type</div>
//       )}
//     </Card>
//   )
// }

// export default QuestionCard

import React, { useState, useEffect } from "react"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Categorize from "./catogorize"
import Cloze from "./cloze"
import Comprehension from "./comprehension"

const QuestionCard = ({ questionId, onDataChange }) => {
  const [questionData, setQuestionData] = useState({
    id: questionId,
    questionType: "None",
    mediaType: "None",
    points: "",
    title: "",
    picture: "",
    description: "",
    categorizeData: { categories: [], items: [] },
    clozeData: { sentence: [], options: [], feedback: [] },
    compData: [],
    answers: [],
  })

  // Sync questionData with the parent component
  useEffect(() => {
    onDataChange(questionData)
  }, [questionData, onDataChange])

  // Handle changes to the form fields
  const handleChange = (field, value) => {
    setQuestionData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleChange("picture", reader.result) // Save the base64 string
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className='w-full p-6'>
      <h2 className='text-xl font-bold mb-4'>Question {questionId}</h2>

      {/* Question Type Dropdown */}
      <div className='flex justify-evenly mb-4 gap-5'>
        <div className='w-1/3'>
          <Label className='block text-sm font-medium text-gray-700'>
            Question Type
          </Label>
          <Select
            value={questionData.questionType}
            onValueChange={(value) => handleChange("questionType", value)}>
            <SelectTrigger className='mt-1 w-full p-2 border border-gray-300 rounded-md'>
              {questionData.questionType}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='None'>None</SelectItem>
              <SelectItem value='Categorize'>Categorize</SelectItem>
              <SelectItem value='Cloze'>Cloze</SelectItem>
              <SelectItem value='Comprehension'>Comprehension</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='w-1/3'>
          <Label className='block text-sm font-medium text-gray-700'>
            Media Type
          </Label>
          <Select
            value={questionData.mediaType}
            onValueChange={(value) => handleChange("mediaType", value)}>
            <SelectTrigger className='mt-1 w-full p-2 border border-gray-300 rounded-md'>
              {questionData.mediaType}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='None'>None</SelectItem>
              <SelectItem value='Image'>Image</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Points Input */}
        <div className='w-1/3'>
          <Label
            htmlFor='points'
            className='block text-sm font-medium text-gray-700'>
            Points
          </Label>
          <Input
            id='points'
            type='number'
            value={questionData.points}
            onChange={(e) => handleChange("points", e.target.value)}
            className='mt-1 w-full p-2 border border-gray-300 rounded-md'
          />
        </div>
      </div>

      {/* Image Upload */}
      {questionData.mediaType === "Image" && (
        <div className='mb-4'>
          <Label
            htmlFor='picture'
            className='block text-sm font-medium text-gray-700'>
            Upload Image
          </Label>
          <Input
            id='picture'
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='mt-1 w-full p-2 border border-gray-300 rounded-md'
          />
          {questionData.picture && (
            <img
              src={questionData.picture}
              alt='Preview'
              className='mt-2 max-h-32'
            />
          )}
        </div>
      )}

      {/* Title Input */}
      <div className='mb-4'>
        <Label
          htmlFor='title'
          className='block text-sm font-medium text-gray-700'>
          Title
        </Label>
        <Input
          id='title'
          value={questionData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className='mt-1 w-full p-2 border border-gray-300 rounded-md'
          placeholder='Enter the Title here...'
        />
      </div>

      {/* Description Input */}
      <div className='mb-4'>
        <Label
          htmlFor='description'
          className='block text-sm font-medium text-gray-700'>
          {questionData.questionType === "Comprehension"
            ? `Comprehension Passage`
            : `Description`}
        </Label>
        <Textarea
          id='description'
          rows='4'
          value={questionData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className='mt-1 w-full p-2 border border-gray-300 rounded-md'
          placeholder='Enter the question description here...'></Textarea>
      </div>

      {/* Dynamic Component Based on Question Type */}
      {questionData.questionType === "Categorize" ? (
        <Categorize
          onCategorizeChange={(data) => handleChange("categorizeData", data)}
        />
      ) : questionData.questionType === "Cloze" ? (
        <Cloze onClozeChange={(data) => handleChange("clozeData", data)} />
      ) : questionData.questionType === "Comprehension" ? (
        <Comprehension
          onCompChange={(data) => handleChange("compData", data)}
        />
      ) : (
        <div className='text-center'>Choose a question type</div>
      )}
    </Card>
  )
}

export default QuestionCard
