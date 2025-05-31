import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAuth } from '../supabaseClient';

function Login({ setUserData }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await handleAuth({ email, password, isLogin: true });
      if (result.success) {
        // データをセッションストレージに保存
        sessionStorage.setItem('userId', result.data.user_id);
        sessionStorage.setItem('groupId', result.data.group_id);
        
        // グローバルの状態を更新
        setUserData(result.data);
        navigate('/emotion');
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError('ログイン中にエラーが発生しました。');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="container">
      {!showLogin ? (
        <>
          <button className="primary" onClick={() => setShowLogin(true)}>ログイン</button>
          <button className="secondary" onClick={() => navigate('/signup')}>ユーザー登録</button>
        </>
      ) : (
        <>
          <h2>ログイン</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="primary" type="submit">ログイン</button>
          </form>
          {error && <p className="error-message">{error}</p>}
          <button className="tertiary" onClick={() => setShowLogin(false)}>戻る</button>
        </>
      )}
    </div>
  );
}

export default Login;