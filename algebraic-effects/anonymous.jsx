import React from 'react';
// For HMR, mark slides.mdx as a dependency so the dispose handler is run when slides.mdx changes
import './slides.mdx';

const components = new Map();
// Preserve identity of anonymous function components
export function mkAnon(fn) {
  const key = fn.name;
  if(!key) {
    throw new Error('Function must have name');
  }

  return components.has(key)
    ? components.get(key)
    : (components.set(key, fn), fn);
}
export function anon(f) {
  const Component = mkAnon(f);
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
