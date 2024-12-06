// export default Cloze;
import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Underline, GripVertical } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Sortable item component
const SortableItem = ({ id, content, onOptionChange, onRemoveOption }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='flex items-center space-x-2 p-2 border rounded-md bg-white mb-2'>
      <div {...attributes} {...listeners} className='cursor-move'>
        <GripVertical className='h-5 w-5 text-gray-500' />
      </div>
      <Input
        value={content}
        onChange={(e) => onOptionChange(id, e.target.value)}
        className='flex-1'
        placeholder='Enter option'
      />
      <Button
        type='button'
        variant='ghost'
        size='icon'
        onClick={() => onRemoveOption(id)}
        className='text-red-500'>
        <span className='text-xl mb-2'>×</span>
      </Button>
    </div>
  )
}

const Cloze = ({ onClozeChange }) => {
  const [sentence, setSentence] = useState("")
  const [options, setOptions] = useState([])
  const [feedback, setFeedback] = useState("")
  const [preview, setPreview] = useState("")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Update options and preview when sentence changes
  useEffect(() => {
    updateOptions(sentence)
    updatePreview(sentence)
  }, [sentence])

  // Notify parent about changes in cloze data
  useEffect(() => {
    onClozeChange({
      sentence,
      options,
      feedback,
    })
  }, [sentence, options, feedback, onClozeChange])

  // handle sentence input change
  const handleSentenceChange = (e) => {
    setSentence(e.target.value)
  }

  // Formatting selected text
  const handleFormatting = (format) => {
    const textarea = document.getElementById("sentence")
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = sentence.substring(start, end)

    if (!selectedText.trim()) return

    let formatted = selectedText
    if (format === "underline") formatted = `<u>${selectedText}</u>`

    const newSentence =
      sentence.substring(0, start) + formatted + sentence.substring(end)
    setSentence(newSentence)

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + formatted.length
      textarea.focus()
    }, 0)
  }

  // Update options from sentence
  const updateOptions = (text) => {
    const blanks = text.match(/<u>(.*?)<\/u>/g) || []
    const newOptions = blanks.map((word, index) => ({
      id: `option-${index}`,
      content: word.replace(/<\/?u>/g, ""),
    }))
    setOptions(newOptions)
  }

  // Update preview from sentence
  const updatePreview = (text) => {
    const previewText = text.replace(/<u>(.*?)<\/u>/g, "____")
    setPreview(previewText)
  }

  // Add a new option to the list
  const handleAddOption = () => {
    const newOption = {
      id: `option-${options.length}`,
      content: "",
    }
    setOptions((prevOptions) => {
      return [...prevOptions, newOption]
    })
  }

  // Update a specific option
  const handleOptionChange = (id, value) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, content: value } : option
      )
    )
  }

  // Remove an option
  const handleRemoveOption = (id) => {
    const optionToRemove = options.find((option) => option.id === id)
    if (optionToRemove) {
      const newOptions = options.filter((option) => option.id !== id)
      setOptions(newOptions)

      const newSentence = sentence.replace(
        new RegExp(`<u>${optionToRemove.content}</u>`),
        optionToRemove.content
      )
      setSentence(newSentence)
    }
  }

  // Handle the drag and drop sorting of options
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setOptions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <>
      {/* Preview Section */}
      <div className='mb-4'>
        <Label className='block text-sm font-medium text-gray-700'>
          Preview
        </Label>
        <div className='mt-1 p-2 border border-gray-300 rounded-md bg-gray-50'>
          {preview}
        </div>
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='sentence'
          className='block text-sm font-medium text-gray-700 mb-2'>
          Sentence - Select the word and click underline formatting button
        </Label>
        <Button
          variant='ghost'
          aria-label='Toggle underline'
          onClick={() => handleFormatting("underline")}
          className='bg-slate-200'>
          <Underline className='h-3 w-3' />
        </Button>
        <Textarea
          id='sentence'
          rows={4}
          value={sentence}
          onChange={handleSentenceChange}
          className='mt-2 w-full p-2 border border-gray-300 rounded-md'
          placeholder='Type the sentence here...'
        />
      </div>

      <div className='mb-4'>
        <Label className='block text-sm font-medium text-gray-700'>
          Options
        </Label>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <SortableContext
            items={options.map((option) => option.id)}
            strategy={verticalListSortingStrategy}>
            {options.map((option) => (
              <SortableItem
                key={option.id}
                id={option.id}
                content={option.content}
                onOptionChange={handleOptionChange}
                onRemoveOption={handleRemoveOption}
              />
            ))}
          </SortableContext>
        </DndContext>
        <div className='flex justify-center'>
          <Button
            type='button'
            onClick={handleAddOption}
            className='mt-2 bg-green-500 text-white'>
            Add Option
          </Button>
        </div>
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='feedback'
          className='block text-sm font-medium text-gray-700'>
          Feedback (Optional)
        </Label>
        <Input
          id='feedback'
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className='mt-1 w-full p-2 border border-gray-300 rounded-md'
          placeholder='Add optional feedback'
        />
      </div>
    </>
  )
}

export default Cloze
