import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select"

const Categorize = ({ onCategorizeChange }) => {
  const [categoryName, setCategoryName] = useState("")
  const [categories, setCategories] = useState([])
  const [itemName, setItemName] = useState("")
  const [items, setItems] = useState([])

  const groupItemsBycategoryName = (items, categories) => {
    const grouped = categories.reduce((acc, cat) => {
      acc[cat] = items
        .filter((item) => item.categoryName === cat)
        .map((i) => i.name)
      return acc
    }, {})
    return grouped
  }

  // Updated `onCategorizeChange` calls
  const handleAddcategoryName = () => {
    if (categoryName && !categories.includes(categoryName)) {
      const newCategories = [...categories, categoryName]
      setCategories(newCategories)
      setCategoryName("")
      onCategorizeChange({
        categories: newCategories,
        groupedItems: groupItemsBycategoryName(items, newCategories),
      })
    }
  }

  const handleRemovecategoryName = (catToRemove) => {
    const newCategories = categories.filter((cat) => cat !== catToRemove)
    const filteredItems = items.filter(
      (item) => item.categoryName !== catToRemove
    )
    setCategories(newCategories)
    setItems(filteredItems)
    onCategorizeChange({
      categories: newCategories,
      groupedItems: groupItemsBycategoryName(filteredItems, newCategories),
    })
  }

  const handleAddItem = () => {
    if (itemName) {
      const newItems = [...items, { name: itemName, categoryName: "" }]
      setItems(newItems)
      setItemName("")
      onCategorizeChange({
        categories,
        groupedItems: groupItemsBycategoryName(newItems, categories),
      })
    }
  }

  const handleItemcategoryNameChange = (index, value) => {
    const updatedItems = [...items]
    updatedItems[index].categoryName = value
    setItems(updatedItems)
    onCategorizeChange({
      categories,
      groupedItems: groupItemsBycategoryName(updatedItems, categories),
    })
  }

  const handleRemoveItem = (itemToRemove) => {
    const updatedItems = items.filter((item) => item !== itemToRemove)
    setItems(updatedItems)
    onCategorizeChange({
      categories,
      groupedItems: groupItemsBycategoryName(updatedItems, categories),
    })
  }

  return (
    <>
      {/* Add Categories */}
      <div className='mb-4'>
        <Label className='block text-sm font-medium text-gray-700'>
          Add categoryName
        </Label>
        <div className='flex items-center space-x-2'>
          <Input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className='w-full'
            placeholder='categoryName name'
          />
          <Button
            onClick={handleAddcategoryName}
            className='bg-blue-500 text-white'>
            Add
          </Button>
        </div>
      </div>

      {/* List of Added Categories as Tabs with Remover */}
      {categories.length > 0 && (
        <div className='mb-4'>
          <h3 className='text-lg font-semibold mb-2'>Added Categories</h3>
          <div className='flex flex-wrap gap-2'>
            {categories.map((cat, index) => (
              <div
                key={index}
                className='flex justify-around items-center space-x-4 bg-gray-200 rounded-full px-4 py-2 text-gray-700'>
                <span>{cat}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleRemovecategoryName(cat)}
                  className='w-3 h-3 mb-1 hover:bg-gray-200 text-red-500 hover:text-red-500'>
                  <span className='text-xl'>×</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Add Items */}
      <div className='mb-4'>
        <Label className='block text-sm font-medium text-gray-700'>
          Add Item
        </Label>
        <div className='flex items-center space-x-2'>
          <Input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className='w-full'
            placeholder='Item name'
          />
          <Button onClick={handleAddItem} className='bg-blue-500 text-white'>
            Add
          </Button>
        </div>
      </div>
      {/* List of Items */}
      {items.length > 0 && (
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-semibold mb-2'>Items</h3>
          {items.map((item, index) => (
            <div key={index} className='flex items-center space-x-2'>
              <Input value={item.name} className='w-1/2' readOnly />
              <Select
                value={item.categoryName}
                onValueChange={(value) =>
                  handleItemcategoryNameChange(index, value)
                }
                className='w-1/2'>
                <SelectTrigger className='w-full p-2 border rounded'>
                  {item.categoryName || "Select categoryName"}
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat, i) => (
                    <SelectItem key={i} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant='ghost'
                onClick={() => handleRemoveItem(item)}
                className='text-red-500'>
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Categorize
