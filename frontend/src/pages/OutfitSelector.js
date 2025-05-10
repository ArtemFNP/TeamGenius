import React from 'react';

export default function OutfitSelector() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f8fa',
      padding: 24
    }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Outfit Selector</h1>
      <p style={{ fontSize: 18, color: '#555', textAlign: 'center', maxWidth: 400 }}>
        Here you will be able to select the best outfit for the weather and your transport mode.<br />
        (This page is adaptive for smartphones and computers.)
      </p>
    </div>
  );
} 