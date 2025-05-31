import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIChat from './AIChat';

function EmotionSelection({ setEmotionData, userData }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [emotionResult, setEmotionResult] = useState(null);
  const [atmosphereResult, setAtmosphereResult] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userId, setUserId] = useState(() => {
    // セッションストレージから取得を優先
    const sessionUserId = sessionStorage.getItem('userId');
    if (sessionUserId) return sessionUserId;
    // userData経由での取得をバックアップとする
    return userData?.user_id || "";
  });
  const [groupId, setGroupId] = useState(() => {
    // セッションストレージから取得を優先
    const sessionGroupId = sessionStorage.getItem('groupId');
    if (sessionGroupId) return sessionGroupId;
    // userData経由での取得をバックアップとする
    return userData?.group_id || "";
  });
  const currentDateTime = new Date();

  // 質問テキストを適切な場所で改行する関数
  const formatQuestionText = (text) => {
    // 長い質問テキストの場合のみ改行
    if (text.length > 40) {
      // 自然な区切りで改行する
      const breakPoints = [
        'ですか？', 'でしたか？', // 「ですか？」「でしたか？」
        'のです。', 'ました。', // 「のです。」「ました。」
        'ですね。', 'ですが、', // 「ですね。」「ですが、」
        'です。それは', 'です。これは', // 「です。それは」「です。これは」
      ];
      
      let result = text;
      for (const point of breakPoints) {
        if (text.includes(point)) {
          result = text.replace(point, `${point}<br/>`);
          break;
        }
      }
      
      // 改行ポイントが見つからない場合は、長さの半分で改行
      if (result === text && text.length > 40) {
        const midPoint = Math.floor(text.length / 2);
        let breakIndex = text.indexOf('、', midPoint - 10);
        if (breakIndex === -1) breakIndex = text.indexOf('。', midPoint - 10);
        if (breakIndex === -1) breakIndex = midPoint;
        
        result = text.substring(0, breakIndex + 1) + '<br/>' + text.substring(breakIndex + 1);
      }
      
      return result.split('<br/>').map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </React.Fragment>
      ));
    }
    return text;
  };

  // ボタンテキストを適切な場所で改行する関数
  const formatButtonText = (text) => {
    // 長いボタンテキストの場合のみ改行
    if (text.length > 20) {
      // 自然な区切りで改行する
      const breakPoints = [
        'だった', 'でした', // 「だった」「でした」
        'で、', 'であり', // 「で、」「であり」
        '、そして', '、また', // 「、そして」「、また」
      ];
      
      let result = text;
      for (const point of breakPoints) {
        if (text.includes(point)) {
          result = text.replace(point, `${point}<br/>`);
          break;
        }
      }
      
      // 改行ポイントが見つからない場合は、長さの半分で改行
      if (result === text && text.length > 20) {
        const midPoint = Math.floor(text.length / 2);
        let breakIndex = text.indexOf('、', midPoint - 5);
        if (breakIndex === -1) breakIndex = midPoint;
        
        result = text.substring(0, breakIndex + 1) + '<br/>' + text.substring(breakIndex + 1);
      }
      
      return result.split('<br/>').map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </React.Fragment>
      ));
    }
    return text;
  };

  const parseCoordinates = (result) => {
    const match = result.match(/\(x=(-?\d+), y=(-?\d+)\)/);
    return match ? { x: parseInt(match[1]), y: parseInt(match[2]) } : null;
  };

  const handleConfirmation = () => {
    const emotionCoords = parseCoordinates(emotionResult);
    const atmosphereCoords = parseCoordinates(atmosphereResult);
    
    if (emotionCoords && atmosphereCoords) {
      setCoordinates({
        emotion: emotionCoords,
        atmosphere: atmosphereCoords
      });
      setShowAIChat(true);
    }
  };

  const handleOptionSelection = (option) => {
    if (option.text === "グラフタッチ入力") {
      setShowAIChat(true);
    } else if (option.result) {
      if (!emotionResult) {
        setEmotionResult(option.result);
        setCurrentNode({
          question: "今日1日周囲の人たちはどのような雰囲気でしたか？",
          options: [
            {
              text: "どちらかといえば良い雰囲気だった",
              next: {
                question: "この1日は良い雰囲気だったのですね。それはどのような良い雰囲気でしたか？",
                options: [
                  {
                    text: "どちらかと言えば刺激的で楽しい雰囲気だった",
                    next: {
                      question: "この1日は刺激的で楽しい雰囲気だったのですね。それはどの程度刺激的で楽しい雰囲気でしたか？",
                      options: [
                        {
                          text: "少し刺激的で楽しい雰囲気だった",
                          result: "やや刺激的な楽しい雰囲気 (x=30, y=30)",
                        },
                        {
                          text: "まあまあ刺激的で楽しい雰囲気だった",
                          result: "かなり刺激的な楽しい雰囲気 (x=60, y=60)",
                        },
                        {
                          text: "非常に刺激的で楽しい雰囲気だった",
                          result: "大変刺激的な楽しい雰囲気 (x=90, y=90)",
                        },
                      ],
                    },
                  },
                  {
                    text: "どちらかと言えばリラックスした雰囲気だった",
                    next: {
                      question: "この1日はリラックスした雰囲気だったのですね。それはどの程度リラックスした雰囲気でしたか？",
                      options: [
                        {
                          text: "少しリラックスした雰囲気だった",
                          result: "ややリラックスした穏やかな雰囲気 (x=-30, y=30)",
                        },
                        {
                          text: "まあまあリラックスした雰囲気だった",
                          result: "かなりリラックスした穏やかな雰囲気 (x=-60, y=60)",
                        },
                        {
                          text: "非常にリラックスした雰囲気だった",
                          result: "大変リラックスした穏やかな雰囲気 (x=-90, y=90)",
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              text: "どちらかといえば良くない雰囲気だった",
              next: {
                question: "この1日は良くない雰囲気だったのですね。それはどのような良くない雰囲気でしたか？",
                options: [
                  {
                    text: "どちらかといえばイライラして嫌な雰囲気だった",
                    next: {
                      question: "この1日はイライラして嫌な雰囲気だったのですね。それはどの程度イライラして嫌な雰囲気でしたか？",
                      options: [
                        {
                          text: "少しイライラして嫌な雰囲気だった",
                          result: "ややイライラした雰囲気 (x=30, y=-30)",
                        },
                        {
                          text: "まあまあイライラして嫌な雰囲気だった",
                          result: "かなりイライラした雰囲気 (x=60, y=-60)",
                        },
                        {
                          text: "非常にイライラして嫌な雰囲気だった",
                          result: "大変イライラした雰囲気 (x=90, y=-90)",
                        },
                      ],
                    },
                  },
                  {
                    text: "どちらかといえば不安そうで暗い雰囲気だった",
                    next: {
                      question: "この1日は不安そうで暗い雰囲気だったのですね。それはどの程度不安そうで暗い雰囲気でしたか？",
                      options: [
                        {
                          text: "少し不安そうで暗い雰囲気だった",
                          result: "やや不安な落ち込んだ雰囲気 (x=-30, y=-30)",
                        },
                        {
                          text: "まあまあ不安そうで暗い雰囲気だった",
                          result: "かなり不安な落ち込んだ雰囲気 (x=-60, y=-60)",
                        },
                        {
                          text: "非常に不安そうで暗い雰囲気だった",
                          result: "大変不安な落ち込んだ雰囲気 (x=-90, y=-90)",
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        });
      } else {
        setAtmosphereResult(option.result);
        setShowConfirmation(true);
      }
    } else if (option.next) {
      setHistory([...history, currentNode]);
      setCurrentNode(option.next);
    }
  };

  const [currentNode, setCurrentNode] = useState({
    question: "入力方法を選択してください",
    options: [
      {
        text: "テキスト選択入力",
        next: {
          question: "今日1日あなたはどのような気分でしたか？",
          options: [
            {
              text: "どちらかといえば良い気分で過ごした",
              next: {
                question: "この1日は良い気分だったのですね。それはどのような良い気分でしたか？",
                options: [
                  {
                    text: "どちらかと言えば刺激的で楽しい気分だった",
                    next: {
                      question: "この1日は刺激的で楽しい気分だったのですね。それはどの程度刺激的でしたか？",
                      options: [
                        {
                          text: "少し刺激的で興奮した",
                          next: {
                            question: "少し刺激的で興奮した気分だったのですね。それはどのような気分でしたか？",
                            options: [
                              {
                                text: "どちらかといえば人のことで興奮して楽しかった",
                                result: "やや興奮した楽しい気分 (x=30, y=15)",
                              },
                              {
                                text: "人にも自分にも同じぐらい興奮して楽しかった",
                                result: "やや興奮した楽しい気分 (x=30, y=30)",
                              },
                              {
                                text: "どちらかといえば自分のことで興奮して楽しかった",
                                result: "やや興奮した楽しい気分 (x=15, y=30)",
                              },
                            ],
                          },
                        },
                        {
                          text: "まあまあ刺激的で興奮した",
                          next: {
                            question: "まあまあ刺激的で興奮した気分だったのですね。それはどのような気分でしたか？",
                            options: [
                              {
                                text: "どちらかといえば人のことで興奮して楽しかった",
                                result: "かなり興奮した楽しい気分 (x=60, y=30)",
                              },
                              {
                                text: "人にも自分にも同じぐらい興奮して楽しかった",
                                result: "かなり興奮した楽しい気分 (x=60, y=60)",
                              },
                              {
                                text: "どちらかといえば自分のことで興奮して楽しかった",
                                result: "かなり興奮した楽しい気分 (x=30, y=60)",
                              },
                            ],
                          },
                        },
                        {
                          text: "非常に刺激的で興奮した",
                          next: {
                            question: "非常に刺激的で興奮した気分だったのですね。それはどのような気分でしたか？",
                            options: [
                              {
                                text: "どちらかといえば人のことで興奮して楽しかった",
                                result: "大変興奮した楽しい気分 (x=90, y=45)",
                              },
                              {
                                text: "人にも自分にも同じぐらい興奮して楽しかった",
                                result: "大変興奮した楽しい気分 (x=90, y=90)",
                              },
                              {
                                text: "どちらかといえば自分のことで興奮して楽しかった",
                                result: "大変興奮した楽しい気分 (x=45, y=90)",
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  {
                    text: "どちらかと言えばリラックスした気分だった",
                    next: {
                      question: "この1日はリラックスした気分だったのですね。それはどの程度リラックスしましたか？",
                      options: [
                        {
                          text: "少しリラックスした",
                          next: {
                            question: "少しリラックスした気分だったのですね。それはどのような気分でしたか？",
                            options: [
                              {
                                text: "どちらかといえば人の言動でリラックスし、その人がいなければ感じなかった",
                                result: "ややリラックスした穏やかな気分 (x=-15, y=30)",
                              },
                              {
                                text: "人にも自分にも同じぐらいリラックスを感じた",
                                result: "ややリラックスした穏やかな気分 (x=-30, y=30)",
                              },
                              {
                                text: "どちらかといえば人とは関係なく自分自身のことでリラックスした",
                                result: "ややリラックスした穏やかな気分 (x=-30, y=15)",
                              },
                            ],
                          },
                        },
                        {
                          text: "まあまあリラックスした",
                          next: {
                            question: "まあまあリラックスした気分だったのですね。それはどのような気分でしたか？",
                            options: [
                              {
                                text: "どちらかといえば人の言動でリラックスし、その人がいなければ感じなかった",
                                result: "かなりリラックスした穏やかな気分 (x=-30, y=60)",
                              },
                              {
                                text: "人にも自分にも同じぐらいリラックスを感じた",
                                result: "かなりリラックスした穏やかな気分 (x=-60, y=60)",
                              },
                              {
                                text: "どちらかといえば人とは関係なく自分自身のことでリラックスした",
                                result: "かなりリラックスした穏やかな気分 (x=-60, y=30)",
                              },
                            ],
                          },
                        },
                        {
                          text: "非常にリラックスした",
                          next: {
                            question: "非常にリラックスした気分だったのですね。それはどのような気分でしたか？",
                            options: [
                              {
                                text: "どちらかといえば人の言動でリラックスし、その人がいなければ感じなかった",
                                result: "大変リラックスした穏やかな気分 (x=-45, y=90)",
                              },
                              {
                                text: "人にも自分にも同じぐらいリラックスを感じた",
                                result: "大変リラックスした穏やかな気分 (x=-90, y=90)",
                              },
                              {
                                text: "どちらかといえば人とは関係なく自分自身のことでリラックスした",
                                result: "大変リラックスした穏やかな気分 (x=-90, y=45)",
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              text: "どちらかといえば良くない気分で過ごした",
              next: {
                question: "この1日は良くない気分だったのですね。それはどのような良くない気分でしたか？",
                options: [
                  {
                    text: "どちらかといえばイライラして嫌な気分だった",
                    next: {
                      question: "この1日はイライラした気分だったのですね。それはどの程度イライラしましたか？",
                      options: [
                        {
                          text: "少しイライラした",
                          next: {
                            question: "[少し]イライラした気分だったのですね。それはどのようなイライラでしたか？",
                            options: [
                              {
                                text: "どちらかといえば人の不快な言動に対してイライラした",
                                result: "ややイライラした気分 (x=30, y=-15)",
                              },
                              {
                                text: "人にも自分にも同じぐらいイライラした",
                                result: "ややイライラした気分 (x=30, y=-30)",
                              },
                              {
                                text: "どちらかといえば自分に対してイライラした",
                                result: "ややイライラした気分 (x=15, y=-30)",
                              },
                            ],
                          },
                        },
                        {
                          text: "まあまあイライラした",
                          next: {
                            question: "[まあまあ]イライラした気分だったのですね。それはどのようなイライラでしたか？",
                            options: [
                              {
                                text: "どちらかといえば人の不快な言動に対してイライラした",
                                result: "かなりイライラした気分 (x=60, y=-30)",
                              },
                              {
                                text: "人にも自分にも同じぐらいイライラした",
                                result: "かなりイライラした気分 (x=60, y=-60)",
                              },
                              {
                                text: "どちらかといえば自分に対してイライラした",
                                result: "かなりイライラした気分 (x=30, y=-60)",
                              },
                            ],
                          },
                        },
                        {
                          text: "非常にイライラした",
                          next: {
                            question: "[非常に]イライラした気分だったのですね。それはどのようなイライラでしたか？",
                            options: [
                              {
                                text: "どちらかといえば人の不快な言動に対してイライラした",
                                result: "大変イライラした気分 (x=90, y=-45)",
                              },
                              {
                                text: "人にも自分にも同じぐらいイライラした",
                                result: "大変イライラした気分 (x=90, y=-90)",
                              },
                              {
                                text: "どちらかといえば自分に対してイライラした",
                                result: "大変イライラした気分 (x=45, y=-90)",
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  {
                    text: "どちらかといえば不安で落ち込む気分だった",
                    next: {
                      question: "この1日は不安な気分だったのですね。それはどの程度不安でしたか？",
                      options: [
                        {
                          text: "少し不安だった",
                          next: {
                            question: "[少し]不安な気分だったのですね。それはどのような不安でしたか？",
                            options: [
                              {
                                text: "どちらかといえば人の言動に対して不安を感じた",
                                result: "やや不安な落ち込んだ気分 (x=-30, y=-15)",
                              },
                              {
                                text: "人にも自分にも同じぐらい不安を感じた",
                                result: "やや不安な落ち込んだ気分 (x=-30, y=-30)",
                              },
                              {
                                text: "どちらかといえば人とは関係なく自分自身のことで不安を感じた",
                                result: "やや不安な落ち込んだ気分 (x=-15, y=-30)",
                              },
                            ],
                          },
                        },
                        {
                          text: "まあまあ不安だった",
                          next: {
                            question: "[まあまあ]不安な気分だったのですね。それはどのような不安でしたか？",
                            options: [
                              {
                                text: "どちらかといえば人の言動に対して不安を感じた",
                                result: "かなり不安な落ち込んだ気分 (x=-60, y=-30)",
                              },
                              {
                                text: "人にも自分にも同じぐらい不安を感じた",
                                result: "かなり不安な落ち込んだ気分 (x=-60, y=-60)",
                              },
                              {
                                text: "どちらかといえば人とは関係なく自分自身のことで不安を感じた",
                                result: "かなり不安な落ち込んだ気分 (x=-30, y=-60)",
                              },
                            ],
                          },
                        },
                        {
                          text: "非常に不安だった",
                          next: {
                            question: "[非常に]不安な気分だったのですね。それはどのような不安でしたか？",
                            options: [
                              {
                                text: "どちらかといえば人の言動に対して不安を感じた",
                                result: "大変不安な落ち込んだ気分 (x=-90, y=-45)",
                              },
                              {
                                text: "人にも自分にも同じぐらい不安を感じた",
                                result: "大変不安な落ち込んだ気分 (x=-90, y=-90)",
                              },
                              {
                                text: "どちらかといえば人とは関係なく自分自身のことで不安を感じた",
                                result: "大変不安な落ち込んだ気分 (x=-45, y=-90)",
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        text: "グラフタッチ入力",
      },
    ],
  });

  const goBack = () => {
    if (history.length > 0) {
      setCurrentNode(history[history.length - 1]);
      setHistory(history.slice(0, -1));
    }
  };

  const renderConfirmationScreen = () => {
    return (
      <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#1976d2' }}>選択結果:</h3>
        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.5' }}>感情: {emotionResult}</p>
        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.5' }}>雰囲気: {atmosphereResult}</p>
        <p style={{ marginTop: '15px', fontSize: '16px', color: '#333', lineHeight: '1.5' }}>この内容でよろしいですか？</p>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '10px',
            alignSelf: 'center',
            minWidth: '120px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976d2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196f3'}
          onClick={handleConfirmation}
        >
          はい
        </button>
      </div>
    );
  };

  if (showAIChat) {
    return (
      <AIChat
        userData={userData}
        emotionData={coordinates ? [coordinates.emotion] : []}
        atmosphereData={coordinates ? [coordinates.atmosphere] : []}
      />
    );
  }

  return (
    <div className="kokoro-chat">
      {/* ユーザー情報ヘッダー */}
      <div className="user-info-header">
        <div className="user-info-display">
          <span>ユーザーID: {userId}</span>
          <span>グループID: {groupId}</span>
        </div>
        <div style={{ textAlign: 'right', fontSize: '14px', color: '#333' }}>
          <div>{currentDateTime.toLocaleTimeString()}</div>
          <div>{currentDateTime.toLocaleDateString()}</div>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="chat-history" style={{ backgroundColor: '#e3f2fd', padding: '15px' }}>
        {history.length > 0 && (
          <button
            onClick={goBack}
            style={{
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              color: '#2196f3',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            ← 戻る
          </button>
        )}
        <p style={{
          fontSize: '18px',
          fontWeight: '500',
          textAlign: 'center',
          marginBottom: '20px',
          color: '#1976d2',
          padding: '10px',
          lineHeight: '1.5'
        }}>
          {formatQuestionText(currentNode.question)}
        </p>
        {showConfirmation ? (
          renderConfirmationScreen()
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {currentNode.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelection(option)}
                style={{
                  width: '100%',
                  minHeight: '60px', // 最小の高さを設定
                  padding: '12px 15px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976d2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196f3'}
              >
                <span style={{ display: 'inline-block', width: '100%', whiteSpace: 'normal', lineHeight: '1.4' }}>
                  {formatButtonText(option.text)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* フッター */}
      <div className="operation-buttons">
        <div className="datetime-display">
          {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default EmotionSelection;