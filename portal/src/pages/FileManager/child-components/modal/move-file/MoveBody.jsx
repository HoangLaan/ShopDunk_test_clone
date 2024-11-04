/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import folder from 'pages/FileManager/assets/folder.svg';
import arrow from 'pages/FileManager/assets/arrow.svg';
import { Spin } from 'antd';
import { Divider, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import fileManager from 'pages/FileManager/actions/file-manager';
import EmptyFile from '../../body/quick/EmptyFile';

const Wrapper = styled.div`
  width: 100%;
`;

const Body = styled.div`
  height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
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

const FolderSection = styled.div`
  width: 100%;
  height: 47px;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: ${(props) => (props.active ? '#f2f2f2' : 'white')};
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  .left {
    display: flex;
    align-items: center;
    .name {
      margin-left: 5px;
    }
  }
`;

const Icon = styled.img`
  font-size: 16px;
`;

const DividerStyled = styled(Divider)`
  width: 110% !important;
  min-width: 100%;
  margin: 24px -24px !important;
`;

const FooterStyled = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  align-items: center;
  cursor: pointer;
  .create-folder {
    width: 150px;
    color: #2f80ee;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
const ButtonStyled = styled(Button)`
  border-radius: 4px;
`;

const MoveBody = ({ defaultValue, setParams, setParentParams, onClose, onRefesh }) => {
  const dispatch = useDispatch();
  const { allItemsList, getAllItemsListLoading } = useSelector((state) => state.fileManager);
  const [activeValue, setActiveValue] = useState(undefined);

  const handleClick = (e, p) => {
    switch (e.detail) {
      case 1:
        setActiveValue(p);
        break;
      case 2:
        setActiveValue(undefined);
        setParentParams(allItemsList?.parentFolder);
        setParams({
          document_type_id: p?.document_type_id,
          directory_id: p?.directory_id,
        });
        break;
    }
  };

  const handleSubmit = async () => {
    let params = {};
    let type;
    if (Boolean(defaultValue?.is_file)) {
      type = 'move-file';
      params.file_id = defaultValue?.file_id;
      params.directory_id = activeValue?.directory_id || allItemsList?.parentFolder?.directory_id;
      params.indexColumn = allItemsList?.pathArray?.length + 1;
    } else {
      type = 'move-dir';
      params.directory_id = defaultValue?.directory_id;
      params.parent_id = activeValue?.directory_id || allItemsList?.parentFolder?.directory_id;
    }
    try {
      await dispatch(fileManager.moveItems(type, params));
      onClose();
      onRefesh(params);
    } catch (error) {}
  };

  return (
    <Wrapper>
      <Body>
        {getAllItemsListLoading && <Spin />}
        {Boolean(allItemsList?.items?.length) ? (
          allItemsList?.items?.map(
            (value, index) =>
              Boolean(value?.is_directory) && (
                <FolderSection
                  active={activeValue?.directory_id === value?.directory_id}
                  onClick={(e) => handleClick(e, value)}
                  key={index}>
                  <div className='left'>
                    <Icon src={folder} />
                    <span className='name'>{value?.directory_name}</span>
                  </div>
                  <div className='right'>
                    <Icon src={arrow} />
                  </div>
                </FolderSection>
              ),
          )
        ) : (
          <EmptyFile />
        )}
      </Body>
      <DividerStyled />
      <FooterStyled>
        <div className='create-folder'>
          {/* <img src={create}></img>
          Tạo thư mục mới */}
        </div>
        <ButtonStyled onClick={() => handleSubmit()} type='primary' size='large'>
          Xong
        </ButtonStyled>
      </FooterStyled>
    </Wrapper>
  );
};

MoveBody.propTypes = {
  defaultValue: PropTypes.object,
  setParams: PropTypes.func,
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

MoveBody.defaultProps = {
  defaultValue: {},
  setParams: () => {},
  onRefresh: () => {},
  onClose: () => {},
};

export default MoveBody;
