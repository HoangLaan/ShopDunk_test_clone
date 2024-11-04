import useQuery from '../hook/useQuery';
import React, {useEffect} from 'react';

export default function ResultConnect(props) {
  let query = useQuery(props);
  const handleLocalStorage = code => {
      window.localStorage.setItem('code', code);
      window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
      if (query?.code) {
          handleLocalStorage(query?.code);
          window.close();
      }
  }, [query]);

  return <div>LOADING</div>;
}
