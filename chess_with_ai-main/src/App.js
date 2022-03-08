import Chessboard from './components/Chessboard';
import './App.css';
import Start from './components/Start';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import React from 'react';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Start />}></Route> 
          <Route path="game/"element={<Chessboard />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
