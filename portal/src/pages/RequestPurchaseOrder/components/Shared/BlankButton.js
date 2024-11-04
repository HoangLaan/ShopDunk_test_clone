import React from 'react';

const BlankButton = ({ onClick, icon, children }) => {
  return (
    <button
    type='button'
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0,
        margin: 0,
        cursor: 'pointer',
        outline: 'none',
      }}
      onClick={(e) => {
        e.preventDefault()
        onClick && onClick()
      }}>
      {icon && <i className={icon} style={{ marginRight: 5 }}></i>}
      {children}
    </button>
  );
};

export default BlankButton;
