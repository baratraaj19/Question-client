import React, { useState } from "react";

const CompView = ({ compData, onAnswerChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (questionId, option) => {
    const updatedOptions = [
      ...selectedOptions.filter((item) => item.questionNo !== questionId),
      { questionNo: questionId, optionChosen: option },
    ];
    setSelectedOptions(updatedOptions);

    // Notify parent about the updated answers
    onAnswerChange(updatedOptions);
  };

  return (
    <div className="p-6 space-y-4">
      {compData.map((question, index) => (
        <div
          key={`comp-question-${index}`}
          className="border rounded-lg shadow-md p-4 bg-white"
        >
          <h2 className="text-lg font-semibold mb-2">
            {question.questionText}
          </h2>
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <label
                key={`comp-option-${optionIndex}`}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
              >
                <input
                  type="radio"
                  name={`comp-question-${index}`}
                  value={option}
                  checked={
                    selectedOptions.find((item) => item.questionNo === index)
                      ?.optionChosen === option
                  }
                  onChange={() => handleOptionChange(index, option)}
                  className="shadcn-radio"
                />
                <span className="text-gray-800">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompView;
