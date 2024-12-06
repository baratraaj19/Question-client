import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Comprehension = ({ onCompChange }) => {
  const [mcqQuestions, setMcqQuestions] = useState([]);

  useEffect(() => {
    // Notify parent component of the updated questions
    onCompChange(mcqQuestions);
  }, [mcqQuestions, onCompChange]);

  const handleAddQuestion = () => {
    setMcqQuestions([
      ...mcqQuestions,
      { questionText: "", options: ["", ""], correctOption: "" },
    ]);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...mcqQuestions];
    updatedQuestions[index].questionText = value;
    setMcqQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...mcqQuestions];
    updatedQuestions[questionIndex].options.push("");
    setMcqQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...mcqQuestions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setMcqQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...mcqQuestions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setMcqQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...mcqQuestions];
    updatedQuestions.splice(index, 1);
    setMcqQuestions(updatedQuestions);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">MCQs</h3>
      <div className="flex flex-col gap-3">
        {mcqQuestions.map((question, questionIndex) => (
          <div
            key={questionIndex}
            className="border border-gray-300 rounded-md p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">
                Question {questionIndex + 1}:
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveQuestion(questionIndex)}
                className="text-red-500"
              >
                <span className="text-xl mb-2">×</span>
              </Button>
            </div>
            <Input
              value={question.questionText}
              onChange={(e) =>
                handleQuestionChange(questionIndex, e.target.value)
              }
              className="mb-4 w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter the question text"
            />
            <h4 className="text-sm font-medium mb-2">Options:</h4>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center mb-2">
                <Input
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(
                      questionIndex,
                      optionIndex,
                      e.target.value
                    )
                  }
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  placeholder={`Option ${optionIndex + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                  className="text-red-500"
                >
                  <span className="text-xl mb-2">×</span>
                </Button>
              </div>
            ))}
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => handleAddOption(questionIndex)}
                className="bg-green-500 text-white mt-2"
              >
                Add Option
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={handleAddQuestion}
          className="mb-4 bg-blue-500 text-white"
        >
          Add Question
        </Button>
      </div>
    </div>
  );
};

export default Comprehension;
