import { useEffect, useRef } from "react";

/**
 * keep a reference to the previous value of a variable
 */

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
