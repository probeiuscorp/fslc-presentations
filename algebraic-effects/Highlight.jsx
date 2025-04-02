import React from 'react';

export const Highlight = ({ children }) => (
  <span style={{
    animation: '4s ease-in infinite alternate highlight-color-shift',
    padding: '0 8px',
  }}>
    {children}
  </span>
);

export const Badge = ({ children }) => (
  <span className="mono" style={{
    backgroundColor: '#ffffff40',
    fontSize: 24,
    padding: '2px 8px',
    borderRadius: 6,
  }}>
    {children}
  </span>
);
