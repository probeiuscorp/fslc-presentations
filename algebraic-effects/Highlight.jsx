import React from 'react';

export const Highlight = ({ children }) => (
  <span style={{
    animation: '4s ease-in infinite alternate highlight-color-shift',
    padding: '0 8px',
  }}>
    {children}
  </span>
);
