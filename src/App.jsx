import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import EmotionSelection from './components/EmotionSelection';
import Dashboard from './components/Dashboard';

function App() {
  const [userData, setUserData] = useState(null);
  const [emotionData, setEmotionData] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login setUserData={setUserData} />} />
          <Route path="/signup" element={<Signup setUserData={setUserData} />} />
          <Route path="/emotion" element={<EmotionSelection setEmotionData={setEmotionData} userData={userData} />} />
          <Route path="/dashboard" element={<Dashboard userData={userData} emotionData={emotionData} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;