import React from 'react';
import queryString from 'query-string';

function useQuery(props) {
    const {search} = props.location || {};
    return React.useMemo(() => queryString.parse(search), [search]);
}

export default useQuery;