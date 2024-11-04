import useQuery from '../hook/useQuery';
import React, {useEffect} from 'react';

export default function ResultConnect(props) {
  let query = useQuery(props);
  const handleLocalStorage = code => {
      window.localStorage.setItem('code_shopee', JSON.stringify(code));
      window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
      if (query?.code) {
          handleLocalStorage(query);
          window.close();
      }
      if(query?.disconnect && query?.shop_id){
          handleLocalStorage(query);
          window.close();
      }
  }, [query]);

  return <div>LOADING</div>;
}
