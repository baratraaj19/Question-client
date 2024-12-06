import React from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";

const DraggableBadge = ({ id, content }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-2 bg-purple-500 text-white rounded-md cursor-pointer shadow-md hover:bg-purple-600"
    >
      {content}
    </div>
  );
};

const DroppableBlank = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const containerStyle = isOver
    ? "bg-green-100 border-green-400"
    : "bg-gray-200 border-gray-300";

  return (
    <div
      ref={setNodeRef}
      className={`border-2 ${containerStyle} rounded-lg px-2 py-1 inline-flex items-center justify-center min-w-[50px]`}
    >
      {children || <span className="text-gray-400">Drop here</span>}
    </div>
  );
};
const ClozeView = ({ clozeData, onAnswerChange }) => {
  const { sentence, options } = clozeData;

  const [droppedItems, setDroppedItems] = React.useState({});

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      const droppedOption = options.find((opt) => opt.id === active.id);
      const blankPosition = over.id;

      // Update the droppedItems state
      setDroppedItems((prev) => {
        const updatedDroppedItems = {
          ...prev,
          [blankPosition]: active.id,
        };

        // Send updated answers back to parent component
        const updatedAnswers = Object.keys(updatedDroppedItems).map((key) => ({
          blank: key,
          answer: options.find((opt) => opt.id === updatedDroppedItems[key])
            .content,
        }));

        onAnswerChange(updatedAnswers);

        return updatedDroppedItems;
      });
    }
  };

  const sentenceParts = sentence[0].split(/<u>(.*?)<\/u>/);
  let blankCounter = 0;

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="p-4">
        <div className="mb-4">
          {sentenceParts.map((part, index) => {
            if (index % 2 === 1) {
              const blankId = `blank-${blankCounter}`;
              blankCounter++;

              return (
                <DroppableBlank key={blankId} id={blankId}>
                  {droppedItems[blankId] &&
                    options.find((opt) => opt.id === droppedItems[blankId])
                      ?.content}
                </DroppableBlank>
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </div>
        <div className="flex gap-4 flex-wrap">
          {options.map((option) => (
            <DraggableBadge
              key={option.id}
              id={option.id}
              content={option.content}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default ClozeView;
