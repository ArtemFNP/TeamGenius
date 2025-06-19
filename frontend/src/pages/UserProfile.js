import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { useOutfitPresets } from '../hooks/useOutfitPresets';
import { useUserCloset } from '../hooks/useUserCloset';
import '../styles/UserProfile.css'; // We'll create this next

export default function UserProfile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { presets } = useOutfitPresets();
  const { userItems } = useUserCloset();

  if (!user) {
    return <div className="user-profile-container">{t('userProfile.loading')}</div>;
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <h2>{t('userProfile.title')}</h2>
        <div className="avatar-display">
          {/* Placeholder for avatar - will implement actual avatar upload later */}
          <div className="diamond-avatar-placeholder">
            <span>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</span>
          </div>
        </div>
        <p><strong>{t('userProfile.username')}:</strong> {user.username}</p>
        <p><strong>{t('userProfile.email')}:</strong> {user.email}</p>
        {user.displayName && <p><strong>{t('userProfile.displayName')}:</strong> {user.displayName}</p>}
        <p><strong>{t('userProfile.totalPresets')}:</strong> {presets.length}</p>
        <p><strong>{t('userProfile.totalClothingItems')}:</strong> {userItems.length}</p>
        {/* Add more user information here later */}
      </div>
    </div>
  );
}
