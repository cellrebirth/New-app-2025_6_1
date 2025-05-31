import React, { useState } from 'react';

const AtmosphereInput = ({ onSubmit }) => {
  const [atmosphere, setAtmosphere] = useState({ x: 0, y: 0 });

  const handleSubmit = () => {
    onSubmit(atmosphere);
  };

  return (
    <div className="atmosphere-input">
      <h2>雰囲気入力</h2>
      <div>
        <label>
          X軸 (活発 / 静か):
          <input
            type="range"
            min="-100"
            max="100"
            value={atmosphere.x}
            onChange={(e) => setAtmosphere({ ...atmosphere, x: parseInt(e.target.value) })}
          />
          {atmosphere.x}
        </label>
      </div>
      <div>
        <label>
          Y軸 (良い / 悪い):
          <input
            type="range"
            min="-100"
            max="100"
            value={atmosphere.y}
            onChange={(e) => setAtmosphere({ ...atmosphere, y: parseInt(e.target.value) })}
          />
          {atmosphere.y}
        </label>
      </div>
      <button onClick={handleSubmit}>送信</button>
    </div>
  );
};

export default AtmosphereInput;