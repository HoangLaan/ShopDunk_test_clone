/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react';
import Header from 'pages/FileManager/child-components/header/Header';
import styled from 'styled-components';

import ColumnSection from 'pages/FileManager/child-components/body/directory/ColumnSection';
import DetailFile from 'pages/FileManager/child-components/body/directory/DetailFile';
import { useDispatch, useSelector } from 'react-redux';
import SearchPage from 'pages/FileManager/child-components/body/list-directory/ListPage';
import fileManager from '../actions/file-manager';

const Wrapper = styled.div`
  background-color: white;
  height: 80vh !important;
  overflow: hidden;
  border-radius: 1em;
`;
const Body = styled.div`
  display: flex;
  height: calc(100% - 70px);
  border: 0.5px solid #ccc; 
  background: white;
  overflow-x: ${(props) => (props.overflowHidden ? 'hidden' : 'scroll')};
  /* width */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const FileManagerPage = () => {
  const dispatch = useDispatch();
  const { allItemsArrayColumn, informationFileData, showSearchFunction } = useSelector((state) => state.fileManager);
  const [filterSearch, setFilterSearch] = useState(undefined);
  const jsx_render = useCallback(() => {
    return allItemsArrayColumn?.map((data, key) => <ColumnSection key={key} data={data} indexColumn={key + 1} />);
  }, [allItemsArrayColumn]);

  const empty_render = useCallback(() => {
    const clone = [];
    if (allItemsArrayColumn?.length < 3) {
      let length;
      if (informationFileData) {
        length = 3 - allItemsArrayColumn?.length;
      } else {
        length = 2 - allItemsArrayColumn?.length;
      }
      for (let i = 0; i < length; i++) {
        clone.push({});
      }
    }
    return clone?.map(() => <ColumnSection />);
  }, [allItemsArrayColumn]);

  const loadDataSearch = useCallback(() => {
    if (filterSearch) dispatch(fileManager.searchAll(filterSearch));
  }, [filterSearch]);
  useEffect(loadDataSearch, [loadDataSearch]);

  const idBody = uuidv4();

  useEffect(() => {
    const width = document.getElementById(idBody).offsetWidth;
    document.getElementById(idBody).scroll(width, 0);
  }, [idBody]);

  return (
    <Wrapper className='bw_main_wrapp'>
      <Header onChange={setFilterSearch} />
      <Body id={idBody} overflowHidden={showSearchFunction}>
        {showSearchFunction ? (
          <SearchPage filterSearch={filterSearch} handleRefresh={loadDataSearch} />
        ) : (
          <>
            <ColumnSection isTypeDocument indexColumn={0} />
            {jsx_render()}
            {informationFileData && <DetailFile />}
            {empty_render()}
          </>
        )}
      </Body>
    </Wrapper>
  );
};

export default FileManagerPage;
