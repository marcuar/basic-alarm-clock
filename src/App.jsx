import { Route, Routes } from "react-router-dom"
import Home from "./Home"
import EditEvent from "./EditEvent"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/edit-event/:id" element={<EditEvent />}/>
    </Routes>
  )
}

export default App
