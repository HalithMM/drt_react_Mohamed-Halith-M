import { Home } from "./Components/Home" 
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SelectedAssets } from "./Components/SelectedAsset";
function App() {  
  return (
     
          <Router>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="selectedAssests" element={<SelectedAssets/>} />
            </Routes>
          </Router>  
  )
}

export default App
