import { useEffect, useState } from 'react';

/**
 * Get created time of component
 */

const useAgeOfComponent = (value) => {
  const [createdTime, setCreatedTime] = useState(null);

  const currentTime = Date.now();
  const ageOfComponent = currentTime - createdTime;

  useEffect(() => {
    setCreatedTime(Date.now());
  }, []);

  return {
    createdTime,
    currentTime,
    ageOfComponent,
  };
};

export default useAgeOfComponent;
