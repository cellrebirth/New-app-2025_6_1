import React from 'react';

const UserInfoForm = ({ userData, onUserDataChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUserDataChange({
      ...userData,
      [name]: value
    });
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    onUserDataChange({
      ...userData,
      [name]: value
    });
  };

  return (
    <div className="user-info-header">
      <div className="user-info-display">
        <span>ユーザーID: {userData.userId}</span>
        <span>グループID: {userData.groupId}</span>
      </div>
      <button className="settings-button">設定</button>
      
      {/* 非表示の日時フィールド - バックグラウンドで維持 */}
      <input
        type="hidden"
        name="date"
        value={userData.date}
        onChange={handleDateTimeChange}
      />
      <input
        type="hidden"
        name="time"
        value={userData.time}
        onChange={handleDateTimeChange}
      />
    </div>
  );
};

export default UserInfoForm;
