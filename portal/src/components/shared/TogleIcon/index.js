import React from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

function ToggleIcon({ style = { fontWeight: 'bold', fontSize: 20 }, toggle = false, setToggle }) {
  return (
    <>
      {toggle ? (
        <PlusOutlined onClick={() => setToggle((t) => !t)} style={style} />
      ) : (
        <MinusOutlined onClick={() => setToggle((t) => !t)} style={style} />
      )}
    </>
  );
}

export default ToggleIcon;
