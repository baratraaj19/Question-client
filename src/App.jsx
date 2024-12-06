import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import FormBuilderPage from "./page/form-builder"
import FormView from "./page/form-view"

function App() {
  return (
    <Router>
      <div className='w-full'>
        <Routes>
          <Route path='/' element={<FormBuilderPage />} />
          <Route path='/view' element={<FormView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
