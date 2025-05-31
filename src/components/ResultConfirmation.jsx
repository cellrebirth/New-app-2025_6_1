import React from 'react';

const ResultConfirmation = ({ emotion, atmosphere, onConfirm, onBack }) => {
  return (
    <div className="result-confirmation">
      <h2>入力結果の確認</h2>
      <p>感情: X: {emotion.x}, Y: {emotion.y}</p>
      <p>雰囲気: X: {atmosphere.x}, Y: {atmosphere.y}</p>
      <button onClick={onConfirm}>確認</button>
      <button onClick={onBack}>戻る</button>
    </div>
  );
};

export default ResultConfirmation;