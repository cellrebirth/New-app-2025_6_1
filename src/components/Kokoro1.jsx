import React from 'react';
import KokoroBase from './KokoroBase';

const Kokoro1 = ({ userData, emotionData, atmosphereData }) => {
  return (
    <KokoroBase
      agentType="KOKORO1"
      userData={userData}
      emotionData={emotionData}
      atmosphereData={atmosphereData}
    />
  );
};

export default Kokoro1;