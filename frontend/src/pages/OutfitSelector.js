import React from 'react';

const transportOptions = ['Car', 'Bike', 'Public Transport', 'Walk'];

export default function OutfitSelector() {
  const [transport, setTransport] = React.useState(transportOptions[0]);

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
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 600,
        marginBottom: 32
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>Outfit Selector</h1>
          <p style={{ fontSize: 18, color: '#555', textAlign: 'left', maxWidth: 400 }}>
            Here you will be able to select the best outfit for the weather and your transport mode.<br />
            (This page is adaptive for smartphones and computers.)
          </p>
        </div>
        <div className="transport-dropdown" style={{ minWidth: 160, marginLeft: 24 }}>
          <label htmlFor="transport-select" style={{ fontWeight: 500, marginRight: 8 }}>Transport:</label>
          <select id="transport-select" value={transport} onChange={e => setTransport(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #b0b0b0', fontSize: '1em', background: '#fff' }}>
            {transportOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
} 