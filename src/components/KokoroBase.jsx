import React, { useState, useEffect } from 'react';
import { sendMessageToMiibo } from '../miiboClient';
import CoordinateGraph from './CoordinateGraph';
import UserInfoForm from './UserInfoForm';
import './KokoroBase.css';

const KokoroBase = ({ agentType, userData: initialUserData, emotionData, atmosphereData }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emotionCoordinates, setEmotionCoordinates] = useState(null); // 初期値はnullに設定
  const [atmosphereCoordinates, setAtmosphereCoordinates] = useState(null); // 初期値はnullに設定
  const [popup, setPopup] = useState({ show: false, message: '' }); // ポップアップの表示状態を管理
  
  // ユーザー情報を初期化
  const [userData, setUserData] = useState(() => {
    console.log('ユーザーデータ初期化開始');
    
    // セッションストレージからユーザーデータを取得（最優先）
    const sessionUserId = sessionStorage.getItem('userId');
    const sessionGroupId = sessionStorage.getItem('groupId');
    
    console.log('セッションストレージからの取得:', { sessionUserId, sessionGroupId });
    
    if (sessionUserId && sessionGroupId) {
      console.log('セッションストレージからユーザーデータを使用');
      return {
        userId: sessionUserId,
        groupId: sessionGroupId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB').slice(0, 5)
      };
    }
    
    // 初期ユーザーデータが提供されている場合（次に優先）
    if (initialUserData) {
      console.log('初期ユーザーデータ:', initialUserData);
      
      // テキスト選択画面からのデータの場合（user_idとgroup_idの形式）
      if (initialUserData.user_id && initialUserData.group_id) {
        console.log('テキスト選択画面からのユーザーデータを使用');
        return {
          userId: initialUserData.user_id,
          groupId: initialUserData.group_id,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-GB').slice(0, 5)
        };
      }
      
      // 通常の形式の場合
      console.log('通常形式の初期ユーザーデータを使用');
      return {
        ...initialUserData,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB').slice(0, 5)
      };
    }
    
    // ローカルストレージからデータを取得（最後の選択肢）
    const savedUserData = localStorage.getItem('userData');
    
    if (savedUserData) {
      console.log('ローカルストレージからユーザーデータを使用');
      const parsedData = JSON.parse(savedUserData);
      return {
        ...parsedData,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB').slice(0, 5)
      };
    }
    
    // 新規セッションの場合
    console.log('新規セッションで空のユーザーデータを使用');
    return {
      userId: '', // 空の値にしてログイン要求を促す
      groupId: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-GB').slice(0, 5)
    };
  });
  
  // 現在の日時を更新する関数
  const updateCurrentTime = () => {
    setUserData(prev => ({
      ...prev,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-GB').slice(0, 5)
    }));
  };
  
  // テキスト選択画面からの座標データを初期化時に設定
  useEffect(() => {
    // emotionDataが配列で提供され、要素がある場合
    if (emotionData && emotionData.length > 0 && emotionData[0]) {
      console.log('テキスト選択画面からの感情座標データを設定:', emotionData[0]);
      setEmotionCoordinates(emotionData[0]);
      
      // 座標が設定されたことを通知
      setPopup({ 
        show: true, 
        message: '感情座標データがグラフに反映されました' 
      });
    }
    
    // atmosphereDataが配列で提供され、要素がある場合
    if (atmosphereData && atmosphereData.length > 0 && atmosphereData[0]) {
      console.log('テキスト選択画面からの雰囲気座標データを設定:', atmosphereData[0]);
      setAtmosphereCoordinates(atmosphereData[0]);
      
      // 既に通知がない場合のみ表示
      if (!(emotionData && emotionData.length > 0 && emotionData[0])) {
        setPopup({ 
          show: true, 
          message: '雰囲気座標データがグラフに反映されました' 
        });
      }
    }
    
    // 両方の座標が設定された場合
    if (emotionData && emotionData.length > 0 && emotionData[0] && 
        atmosphereData && atmosphereData.length > 0 && atmosphereData[0]) {
      setPopup({ 
        show: true, 
        message: '感情と雰囲気の座標データがグラフに反映されました' 
      });
    }
  }, [emotionData, atmosphereData]);
  
  // コンポーネントがマウントされた時とメッセージ送信時に時間を更新
  useEffect(() => {
    updateCurrentTime();
    
    // ユーザーデータをローカルストレージに保存
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // ユーザーIDまたはグループIDが変更された（ログイン/サインアップ）時にメッセージ欄をリセット
    setChatHistory([]);
    setMessage('');
  }, [userData.userId, userData.groupId]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    // 座標の入力状態を確認
    if (!emotionCoordinates && !atmosphereCoordinates) {
      // 両方の座標が未入力の場合
      setPopup({ show: true, message: '感情グラフと雰囲気グラフを入力してください' });
      return;
    } else if (!emotionCoordinates) {
      // 感情座標のみ未入力の場合
      setPopup({ show: true, message: '感情グラフを入力してください' });
      return;
    } else if (!atmosphereCoordinates) {
      // 雰囲気座標のみ未入力の場合
      setPopup({ show: true, message: '雰囲気グラフを入力してください' });
      return;
    }
    
    // メッセージ送信前に入力欄をクリアし、送信ボタンを無効化
    const currentMessage = message;
    setMessage('');

    const userMessage = { type: 'user', content: currentMessage, time: `${userData.date} ${userData.time}` };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    // ストリーミング表示用の初期メッセージを追加
    const initialAiMessage = { type: 'ai', content: '', isStreaming: true };
    setChatHistory(prev => [...prev, initialAiMessage]);

    try {
      const recognitionId = `kg_${userData.userId || 'default_user'}_${userData.groupId || 'default_group'}`;
      const fullMessage = `${currentMessage} 感情XY:(${emotionCoordinates.x},${emotionCoordinates.y}) 雰囲気XY:(${atmosphereCoordinates.x},${atmosphereCoordinates.y}) ${recognitionId}`;

      console.log('Sending message with data:', {
        agentType,
        message: fullMessage,
        userData,
        emotionCoordinates,
        atmosphereCoordinates
      });

      // APIリクエストを送信
      const response = await sendMessageToMiibo(fullMessage, agentType);
      
      if (response.isError) {
        // エラーの場合
        const errorMessage = { type: 'error', content: `エラーが発生しました: ${response.error}` };
        setChatHistory(prev => {
          // ストリーミングメッセージを削除してエラーメッセージを追加
          const filteredHistory = prev.filter(msg => !(msg.type === 'ai' && msg.isStreaming));
          return [...filteredHistory, errorMessage];
        });
      } else {
        // 成功の場合、ストリーミング表示をシミュレート
        const fullResponse = response;
        let currentText = '';
        
        // 文字を一文字ずつ表示
        for (let i = 0; i < fullResponse.length; i++) {
          currentText += fullResponse[i];
          
          // 最後のメッセージを更新
          setChatHistory(prev => {
            const newHistory = [...prev];
            const lastIndex = newHistory.length - 1;
            if (lastIndex >= 0 && newHistory[lastIndex].type === 'ai') {
              newHistory[lastIndex] = { 
                type: 'ai', 
                content: currentText,
                isStreaming: i < fullResponse.length - 1
              };
            }
            return newHistory;
          });
          
          // 文字間の遅延
          if (i < fullResponse.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 30)); // 30ミリ秒の遅延
          }
        }
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      const errorMessage = { type: 'error', content: `エラーが発生しました: ${error.message}` };
      setChatHistory(prev => {
        // ストリーミングメッセージを削除してエラーメッセージを追加
        const filteredHistory = prev.filter(msg => !(msg.type === 'ai' && msg.isStreaming));
        return [...filteredHistory, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFinishOperation = () => {
    // 操作終了処理
    const confirmEnd = window.confirm('本日の操作を終了しますか？');
    if (confirmEnd) {
      // 終了処理（ここでは何もしない）
      alert('操作を終了しました。お疲れ様でした。');
    }
  };

  // 初期状態ではメッセージを表示しない
  useEffect(() => {
    // 初期メッセージの表示を削除
    if (chatHistory.length === 0) {
      setChatHistory([
      ]);
    }
  }, []);

  // ポップアップを閉じる関数
  const closePopup = () => {
    setPopup({ show: false, message: '' });
  };

  return (
    <div className="kokoro-chat">
      {/* カスタムポップアップ */}
      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>{popup.message}</p>
            <button className="popup-close" onClick={closePopup}>閉じる</button>
          </div>
        </div>
      )}
      
      <UserInfoForm
        userData={userData}
        onUserDataChange={setUserData}
      />
      
      <div className="coordinate-graphs">
        <CoordinateGraph
          title="感情グラフ"
          onCoordinateChange={setEmotionCoordinates}
          coordinate={emotionCoordinates}
        />
        <CoordinateGraph
          title="雰囲気グラフ"
          onCoordinateChange={setAtmosphereCoordinates}
          coordinate={atmosphereCoordinates}
        />
      </div>

      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.type} ${msg.isStreaming ? 'streaming' : ''}`}>
            <div className="message-content">{msg.content}</div>
            <div className="message-time">
              {msg.time || `${userData.date} ${userData.time}`}
            </div>
          </div>
        ))}
        {isLoading && !chatHistory.some(msg => msg.isStreaming) && (
          <div className="message loading">
            <div className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="メッセージを入力..."
          rows="1"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || message.trim() === ''}
          className="send-button"
        >
          {isLoading ? '送信中...' : '送信'}
        </button>
      </div>
      
      <div className="datetime-display">
        {userData.date} {userData.time}
      </div>
      
      <div className="operation-buttons">
        <button className="operation-button" onClick={handleFinishOperation}>
          本日の操作終了
        </button>
      </div>
    </div>
  );
};

export default KokoroBase;