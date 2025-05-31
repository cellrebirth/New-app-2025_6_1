import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAuth } from '../supabaseClient';

function Signup({ setUserData }) {
  const [groupId, setGroupId] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [birthYear, setBirthYear] = useState('2000');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    if (
      !groupId ||
      !userId ||
      !email ||
      !birthYear ||
      !gender ||
      !password ||
      !confirmPassword
    ) {
      setError("全ての項目を入力してください");
      return;
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      setError(
        "パスワードは8文字以上で、大文字、小文字、数字、特殊文字を含む必要があります"
      );
      return;
    }

    try {
      const result = await handleAuth({
        email,
        password,
        user_id: userId,
        group_id: groupId,
        birth_year: birthYear,
        gender,
      });

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
    } catch (error) {
      console.error('Error signing up:', error);
      setError("登録中にエラーが発生しました。もう一度お試しください。");
    }
  };

  return (
    <div className="container">
      <div className="settings-icon">⚙️</div>
      <h2>ユーザー登録</h2>
      <button className="primary">QRコードをスキャン</button>
      {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="グループID"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="ユーザーID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="生年"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          required
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">性別を選択</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワードの確認"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="secondary" type="submit">登録</button>
      </form>
      <button className="tertiary" onClick={() => navigate('/')}>戻る</button>
    </div>
  );
}

export default Signup;