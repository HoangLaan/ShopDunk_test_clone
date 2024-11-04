import React from 'react';
import { splitString } from 'utils/index';
import { Tooltip } from 'antd';

const TooltipHanlde = ({ children, maxString = 25 }) => {
  return <Tooltip title={`${children}`}>{splitString(children, maxString)}</Tooltip>;
};
export default TooltipHanlde;
