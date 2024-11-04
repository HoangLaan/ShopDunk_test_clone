import React from 'react';

const useScroll = (ref) => {
  const [isScroll, setIsScroll] = React.useState(false);
  const [scrollHeightPre, setScrollHeightPre] = React.useState();

  React.useEffect(() => {
    if (ref) {
      ref?.current?.addEventListener('scroll', handleScroll);
      return () => {
        ref?.current?.removeEventListener('scroll', handleScroll);
      };
    }
  });

  const isBottom = (ref) => {
    if (!ref.current) {
      return false;
    }
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    if (scrollHeight - (scrollTop + clientHeight) <= 50 && scrollHeight !== scrollHeightPre) {
      setScrollHeightPre(scrollHeight);
      return true;
    }

    return false;
  };

  const handleScroll = () => {
    if (isBottom(ref)) {
      setIsScroll(true);
    } else {
      setIsScroll(false);
    }
  };
  return [isScroll];
};
export default useScroll;
