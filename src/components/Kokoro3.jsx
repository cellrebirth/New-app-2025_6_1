import React from 'react';
import KokoroBase from './KokoroBase';

const Kokoro3 = ({ userData, emotionData, atmosphereData }) => {
  return (
    <KokoroBase
      agentType="KOKORO3"
      userData={userData}
      emotionData={emotionData}
      atmosphereData={atmosphereData}
    />
  );
};

export default Kokoro3;