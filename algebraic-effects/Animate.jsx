import React, { useState, useEffect } from 'react';

export function Trans({ children, width, style }) {
  return (
    <div style={{
      display: 'inline flex',
      transition: 'width 400ms ease-in-out',
      width: (width ?? children.length) * 16,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Reveal({ children, reveal }) {
  return (
    <Trans width={reveal ? children.length : 0}>
      <span style={{ transition: 'opacity 400ms ease-in-out', opacity: reveal ? 1 : 0 }}>
        {children}
      </span>
    </Trans>
  );
}

export function Switcher({ children, me: meRef, switchWith, style }) {
  const [transform, setTransform] = useState({});
  useEffect(() => {
    if(switchWith) {
      if(transform.x) return;
      const me = meRef.current;
      const you = switchWith.current;
      const mine = me.getBoundingClientRect();
      const yours = you.getBoundingClientRect();
      setTransform({
        x: `translateX(${yours.x - mine.x - (mine.width - yours.width)}px)`,
        up: mine.width > yours.width,
        style: {
          width: yours.width,
        },
      });
    } else {
      if(transform.x) {
        setTransform({
          up: !transform.up,
        });
      }
    }
  }, [switchWith]);
  return (
    <div ref={meRef} style={{ ...style, ...transform.style, transform: transform.x, transition: 'width 400ms ease-in-out, transform 400ms ease-in-out' }}>
      <div className={transform.up === true ? 'up-and-over' : transform.up === false ? 'under-and-over' : ''}>
        {children}
      </div>
    </div>
  );
}
