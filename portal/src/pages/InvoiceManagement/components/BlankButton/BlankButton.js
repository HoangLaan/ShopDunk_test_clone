import React from 'react';

const BlankButton = ({ onClick = () => {}, icon, title }) => {
  return (
    <button
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0,
        margin: 0,
        cursor: 'pointer',
        outline: 'none',
      }}
      onClick={onClick}>
      <i className={icon} style={{ marginRight: 5 }}></i>{title}
    </button>
  );
};

export default BlankButton;
