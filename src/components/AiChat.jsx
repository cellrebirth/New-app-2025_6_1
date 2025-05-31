import React, { useState } from 'react';
import Kokoro1 from './Kokoro1';
import Kokoro2 from './Kokoro2';
import Kokoro3 from './Kokoro3';

const AiChat = ({ userData, emotionData, atmosphereData }) => {
  const [selectedAI, setSelectedAI] = useState('KOKORO1');

  const renderSelectedAI = () => {
    switch (selectedAI) {
      case 'KOKORO1':
        return <Kokoro1 userData={userData} emotionData={emotionData} atmosphereData={atmosphereData} />;
      case 'KOKORO2':
        return <Kokoro2 userData={userData} emotionData={emotionData} atmosphereData={atmosphereData} />;
      case 'KOKORO3':
        return <Kokoro3 userData={userData} emotionData={emotionData} atmosphereData={atmosphereData} />;
      default:
        return null;
    }
  };

  return (
    <div className="ai-chat">
      <div className="ai-selector">
        <select value={selectedAI} onChange={(e) => setSelectedAI(e.target.value)}>
          <option value="KOKORO1">ココロ1</option>
          <option value="KOKORO2">ココロ2</option>
          <option value="KOKORO3">ココロ3</option>
        </select>
      </div>
      {renderSelectedAI()}
    </div>
  );
};

export default AiChat;