import React from 'react';
import KokoroBase from './KokoroBase';

const Kokoro2 = ({ userData, emotionData, atmosphereData }) => {
  return (
    <KokoroBase
      agentType="KOKORO2"
      userData={userData}
      emotionData={emotionData}
      atmosphereData={atmosphereData}
    />
  );
};

export default Kokoro2;