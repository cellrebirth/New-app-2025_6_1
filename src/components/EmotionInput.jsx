import React, { useState } from 'react';

const EmotionInput = ({ onSubmit }) => {
  const [emotion, setEmotion] = useState({ x: 0, y: 0 });

  const handleSubmit = () => {
    onSubmit(emotion);
  };

  return (
    <div className="emotion-input">
      <h2>感情入力</h2>
      <div>
        <label>
          X軸 (興奮 / リラックス):
          <input
            type="range"
            min="-100"
            max="100"
            value={emotion.x}
            onChange={(e) => setEmotion({ ...emotion, x: parseInt(e.target.value) })}
          />
          {emotion.x}
        </label>
      </div>
      <div>
        <label>
          Y軸 (快 / 不快):
          <input
            type="range"
            min="-100"
            max="100"
            value={emotion.y}
            onChange={(e) => setEmotion({ ...emotion, y: parseInt(e.target.value) })}
          />
          {emotion.y}
        </label>
      </div>
      <button onClick={handleSubmit}>送信</button>
    </div>
  );
};

export default EmotionInput;