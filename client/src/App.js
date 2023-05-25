// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter , Routes , Route } from "react-router-dom" ;

import Auth from "./components/Auth"
import Home from "./components/Home"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
