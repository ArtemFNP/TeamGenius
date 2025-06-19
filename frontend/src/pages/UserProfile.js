import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { useOutfitPresets } from '../hooks/useOutfitPresets';
import { useUserCloset } from '../hooks/useUserCloset';
import Button from '@mui/material/Button';
import '../styles/UserProfile.css'; // We'll create this next

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const { presets } = useOutfitPresets();
  const { userCloset } = useUserCloset();
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  if (!user) {
    return <div className="user-profile-container">{t('userProfile.loading')}</div>;
  }

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleSaveUsername = async () => {
    if (user && newUsername !== user.username) {
      try {
        await updateUser(user.id, { username: newUsername });
        console.log('Username updated successfully!');
      } catch (error) {
        console.error('Failed to update username:', error);
        // Optionally, show an error message to the user
      }
    }
    setIsEditingUsername(false);
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <div className="profile-header-section">
          <div className="diamond-avatar-placeholder">
            <span>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</span>
          </div>
        </div>
        
        <p><strong>{t('userProfile.username')}:</strong>{' '}
          {isEditingUsername ? (
            <input
              type="text"
              value={newUsername}
              onChange={handleUsernameChange}
              onBlur={handleSaveUsername}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveUsername(); }}
              className="username-input"
            />
          ) : (
            <span onClick={() => setIsEditingUsername(true)} className="editable-username">{user.username}</span>
          )}
        </p>
        <p><strong>{t('userProfile.email')}:</strong> {user.email}</p>
        {user.displayName && <p><strong>{t('userProfile.displayName')}:</strong> {user.displayName}</p>}
        
        <p><strong>{t('userProfile.totalPresets')}:</strong> {presets?.length || 0}</p>
        <p><strong>{t('userProfile.totalClothingItems')}:</strong> {userCloset?.length || 0}</p>



      </div>
    </div>
  );
}
