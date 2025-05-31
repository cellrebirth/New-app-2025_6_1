import React, { useState, useEffect } from 'react';
import './Graph.css';

const Graph = ({ type, onCoordinateSelect, initialCoordinates }) => {
  const isEmotion = type === 'emotion';
  const title = isEmotion ? '感情グラフ' : '雰囲気グラフ';
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (initialCoordinates) {
      setSelectedPoint(initialCoordinates);
    }
  }, [initialCoordinates]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 180 - 90);
    const y = Math.round(90 - ((e.clientY - rect.top) / rect.height) * 180);
    
    setSelectedPoint({ x, y });
    setShowConfirmation(true);
  };

  const confirmSelection = () => {
    if (selectedPoint && onCoordinateSelect) {
      onCoordinateSelect(selectedPoint);
      setShowConfirmation(false);
    }
  };

  const cancelSelection = () => {
    setSelectedPoint(null);
    setShowConfirmation(false);
  };

  const renderSelectedPoint = () => {
    if (!selectedPoint) return null;

    const left = ((selectedPoint.x + 90) / 180) * 100;
    const top = ((90 - selectedPoint.y) / 180) * 100;

    return (
      <div
        className="selected-point"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          background: '#1E90FF'
        }}
      />
    );
  };

  return (
    <div className="graph">
      <div className="graph-title">{title}</div>
      <div className="graph-box" onClick={handleClick}>
        <div className="grid-lines" />
        <div className="quadrant quadrant-tl">
          <span>{isEmotion ? 'リラックス' : 'リラックス'}</span>
        </div>
        <div className="quadrant quadrant-tr">
          <span>{isEmotion ? '興奮' : '興奮'}</span>
        </div>
        <div className="quadrant quadrant-bl">
          <span>{isEmotion ? '不安' : '不安'}</span>
        </div>
        <div className="quadrant quadrant-br">
          <span>{isEmotion ? 'イライラ' : 'イライラ'}</span>
        </div>
        <div className="axis-label axis-top">ポジティブ</div>
        <div className="axis-label axis-bottom">ネガティブ</div>
        <div className="axis-label axis-left">弱い</div>
        <div className="axis-label axis-right">強い</div>
        {renderSelectedPoint()}
      </div>
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>選択した位置を確定しますか？</p>
          <p>
            X: {selectedPoint?.x}, Y: {selectedPoint?.y}
          </p>
          <div className="confirmation-buttons">
            <button className="confirmation-button confirm" onClick={confirmSelection}>
              確定
            </button>
            <button className="confirmation-button cancel" onClick={cancelSelection}>
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Graph;