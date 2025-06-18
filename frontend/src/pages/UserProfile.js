import React from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/UserProfile.css'; // We'll create this next

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return <div className="user-profile-container">Loading user data...</div>;
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <h2>Профіль користувача</h2>
        <div className="avatar-display">
          {/* Placeholder for avatar - will implement actual avatar upload later */}
          <div className="diamond-avatar-placeholder">
            <span>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</span>
          </div>
        </div>
        <p><strong>Ім'я користувача:</strong> {user.username}</p>
        <p><strong>Імейл:</strong> {user.email}</p>
        {user.displayName && <p><strong>Відображуване ім'я:</strong> {user.displayName}</p>}
        {/* Add more user information here later */}
      </div>
    </div>
  );
}
