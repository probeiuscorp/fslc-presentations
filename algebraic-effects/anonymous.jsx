import React from 'react';
// For HMR, mark slides.mdx as a dependency so the dispose handler is run when slides.mdx changes
import './slides.mdx';

const components = new Map();
// Preserve identity of anonymous function components
export function anon(fn) {
  const key = fn.name;
  if(!key) {
    throw new Error('Function must have name');
  }

  const Component = components.has(key)
    ? components.get(key)
    : (components.set(key, fn), fn);
  return <Component />;
}

export function Pass({ children }) {
  return children;
}

if(module.hot) {
  module.hot.dispose(() => {
    components.clear();
  });
}
