import React, { useMemo } from 'react';

function Truncate({ children, maxLength = 50 }) {
  const textTruncate = useMemo(() => {
    if (children && typeof children === 'string' && children.length >= maxLength) {
      const firstBackspace = children && children.slice(0, maxLength).lastIndexOf(' ');
      return `${children.slice(0, firstBackspace)} ...`;
    }
    return children;
  }, [children, maxLength]);
  return <>{textTruncate}</>;
}

export default Truncate;
