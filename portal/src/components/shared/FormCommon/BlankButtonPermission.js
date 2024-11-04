import React from 'react';
import CheckAccess from 'navigation/CheckAccess';

const BlankButtonPermission = ({ onClick, icon, title, permission }) => {
  return (
    <CheckAccess permission={permission}>
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
        <i className={icon} style={{ marginRight: 5 }}></i>
        {title}
      </button>
    </CheckAccess>
  );
};

export default BlankButtonPermission;
