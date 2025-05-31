import React, { useState, useEffect, useRef } from 'react';

const CoordinateGraph = ({ title, onCoordinateChange, coordinate }) => {
  const [selectedPoint, setSelectedPoint] = useState(coordinate);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // グラフごとの象限ラベルを設定
  const getQuadrantLabels = () => {
    if (title === '感情グラフ') {
      return {
        topLeft: 'リラックス',
        topRight: '興奮',
        bottomLeft: '不安',
        bottomRight: 'イライラ'
      };
    } else if (title === '雰囲気グラフ') {
      return {
        topLeft: '穏やか',
        topRight: '活気',
        bottomLeft: '重苦しい',
        bottomRight: '緊張'
      };
    }
    return {
      topLeft: '',
      topRight: '',
      bottomLeft: '',
      bottomRight: ''
    };
  };

  const labels = getQuadrantLabels();

  // コンテナサイズに応じてキャンバスをリサイズする
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // コンテナの実際のサイズを取得
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // キャンバスサイズをコンテナに合わせる
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // キャンバスを再描画
    drawCanvas();
  };

  // リサイズイベントのハンドリング
  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // 初期化時に一度サイズ調整

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // クリックイベントハンドラ
  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200 - 100;
    const y = -((e.clientY - rect.top) / rect.height) * 200 + 100;
    
    const newPoint = {
      x: Math.round(x),
      y: Math.round(y)
    };
    
    setSelectedPoint(newPoint);
    onCoordinateChange(newPoint);
  };

  // キャンバスの描画
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスのサイズ取得
    const width = canvas.width;
    const height = canvas.height;
    
    // キャンバスをクリア
    ctx.clearRect(0, 0, width, height);
    
    // グラフのベース色
    const baseColor = title === '感情グラフ' ? '#e3f2fd' : '#e8f5e9';
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);
    
    // グリッド線の描画
    ctx.beginPath();
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    
    // 縦線（中央）
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    
    // 横線（中央）
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // 象限ラベルの描画
    // フォントサイズを画面サイズに合わせて調整
    const fontSize = Math.max(10, Math.min(14, width / 15));
    ctx.font = `${fontSize}px sans-serif`;
    
    // タイトル描画を無効化（外部HTMLで表示するため）
    // ctx.textAlign = 'center';
    // ctx.fillStyle = '#333';
    // ctx.fillText(title, width / 2, fontSize + 2);
    
    // 軸ラベル
    ctx.fillStyle = '#777';
    const axisLabelSize = Math.max(8, Math.min(12, width / 20));
    ctx.font = `${axisLabelSize}px sans-serif`;
    ctx.fillText('弱い', 15, height / 2 - 5);
    ctx.fillText('強い', width - 15, height / 2 - 5);
    
    ctx.fillText('ポジティブ', width / 2, fontSize + 10);
    ctx.fillText('ネガティブ', width / 2, height - 10);
    
    // 象限のラベル
    ctx.fillStyle = title === '感情グラフ' ? '#2196F3' : '#4CAF50';
    const quadrantFontSize = Math.max(10, Math.min(12, width / 18));
    ctx.font = `${quadrantFontSize}px sans-serif`;
    
    // 第1象限（右上）
    ctx.textAlign = 'center';
    ctx.fillText(labels.topRight, 3 * width / 4, height / 4);
    
    // 第2象限（左上）
    ctx.fillText(labels.topLeft, width / 4, height / 4);
    
    // 第3象限（左下）
    ctx.fillText(labels.bottomLeft, width / 4, 3 * height / 4);
    
    // 第4象限（右下）
    ctx.fillText(labels.bottomRight, 3 * width / 4, 3 * height / 4);
    
    // 選択されたポイントの描画
    if (selectedPoint) {
      const canvasX = ((selectedPoint.x + 100) / 200) * width;
      const canvasY = ((100 - selectedPoint.y) / 200) * height;
      
      const pointRadius = Math.max(6, Math.min(8, width / 25)); // ポイントサイズも調整
      
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, pointRadius, 0, 2 * Math.PI);
      ctx.fillStyle = title === '感情グラフ' ? 'rgba(33, 150, 243, 0.7)' : 'rgba(76, 175, 80, 0.7)';
      ctx.fill();
      ctx.strokeStyle = title === '感情グラフ' ? '#1565C0' : '#2E7D32';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };
  
  // coordinateプロパティが変わったときにselectedPointを更新
  useEffect(() => {
    setSelectedPoint(coordinate);
  }, [coordinate]);

  // 依存配列にdrawCanvasが含まれると無限ループになるため、別のuseEffectで管理
  useEffect(() => {
    drawCanvas();
  }, [selectedPoint, title, labels]);

  return (
    <div className="graph-container" ref={containerRef}>
      <div className="graph-title">{title}</div>
      <canvas 
        ref={canvasRef}
        onClick={handleClick}
        style={{ 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};


export default CoordinateGraph;
