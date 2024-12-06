import React from "react"
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core"

const DraggableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className='p-2 m-2 text-white bg-blue-500 rounded-md cursor-pointer shadow-md hover:bg-blue-600'>
      {children}
    </div>
  )
}

const DroppableContainer = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  const containerStyle = isOver
    ? "bg-green-100 border-green-400"
    : "bg-gray-100 border-gray-300"

  return (
    <div
      ref={setNodeRef}
      className={`border-2 ${containerStyle} rounded-lg p-4 min-h-[150px] w-56 flex flex-col items-center space-y-2 shadow-md`}>
      <h3 className='text-lg font-bold text-gray-700 capitalize'>{id}</h3>
      {children}
    </div>
  )
}

const CategorizeView = ({ categorizeData, onCategorizationChange }) => {
  const { categories, groupedItems } = categorizeData

  const [placements, setPlacements] = React.useState(
    categories.reduce((acc, category) => {
      acc[category] = []
      return acc
    }, {})
  )
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over) {
      const newPlacements = { ...placements } // Copy the current placements

      const category = over.id

      // Ensure the category exists in newPlacements
      if (!newPlacements[category]) {
        newPlacements[category] = []
      }

      // Avoid duplicate placements
      if (!newPlacements[category].includes(active.id)) {
        newPlacements[category].push(active.id) // Append the item
        setPlacements(newPlacements) // Update the state
        console.log(`Placed "${active.id}" in "${category}"`)
      }
    }

    // Now pass the updated placements to the parent component
    onCategorizationChange(placements) // You should use newPlacements here instead of placements

    console.log("Updated placements:", placements)
  }

  const allItems = Object.entries(groupedItems).flatMap(([category, items]) =>
    items.map((item) => ({ id: item, category }))
  )

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className='flex flex-wrap gap-4 justify-center mb-4'>
        {allItems.map((item) => (
          <DraggableItem key={item.id} id={item.id}>
            {item.id}
          </DraggableItem>
        ))}
      </div>
      <div className='flex justify-center space-x-4'>
        {categories.map((category) => (
          <DroppableContainer key={category} id={category}>
            {placements[category].map((item) => (
              <div
                key={item}
                className='p-1 text-sm text-white bg-purple-500 rounded-md'>
                {item}
              </div>
            ))}
          </DroppableContainer>
        ))}
      </div>
    </DndContext>
  )
}

export default CategorizeView
