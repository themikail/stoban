import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KanbanBoard from "./kanbanboard";
import Login from "./log";
import Signup from "./signup";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<KanbanBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
