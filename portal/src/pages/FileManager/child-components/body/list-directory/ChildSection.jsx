/* eslint-disable */
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import folder from 'pages/FileManager/assets/folder.svg';
import owner from 'pages/FileManager/assets/owner.svg';
import fileManager from 'pages/FileManager/actions/file-manager';
import useOutsideClick from 'hooks/use-outside-picker';
import { useDispatch, useSelector } from 'react-redux';
import { getIcon } from 'pages/FileManager/utils/helper';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 58px;
  margin-left: 16px;
  background: ${(props) => (props.activeChildSection ? '#F6F6F6' : 'white')};
  border-left: ${(props) => (props.activeChildSection ? '5px solid #2f80ed!important' : '')};
  align-items: center;
  font-size: 15px !important;
  cursor: pointer;
  position: relative;
  border: 0.1px solid #ccc;
  border-top: unset;
  border-left: unset;
  border-right: unset;
  &:last-child {
    border-bottom: 0.1px solid #ccc;
  }
`;

const Icon = styled.img`
  width: 19px;
  margin: 0 85px;
`;

const IconLeft = styled.img`
  width: 19px;
  margin-left: 19px;
`;

const Size = styled.span`
  overflow: hidden;
  margin-right: 20px;
  color: #828282;
`;

const NameContainer = styled.div`
  display: flex;
  width: 40%;
`;

const NameChild = styled.input`
  color: #222b3c;
  outline: 0px;
  font-size: 15px;
  margin-left: 13px;
  width: 40%;
  border: 0px;
  cursor: pointer;
  background-color: transparent;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const CreateDate = styled.span`
  width: 17%;
  margin-right: 15px;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #828282;
`;

const Author = styled.span`
  width: 20%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #828282;
`;

const ChildSection = ({
  data,
  // name,
  // isFile,
  // isTypeDocument,
  isAddFolder,

  indexChildSection,
  indexColumn,

  handleActiveChildSection,
  activeChildSection,
  setAddNew,

  setViewFolder,
}) => {
  const dispatch = useDispatch();
  const { allItemsArrayColumn, informationFileData } = useSelector((state) => state.fileManager);
  const ref = useRef(null);
  const inputRef = useRef(data);
  const [readOnly, setReadOnly] = useState(!isAddFolder);
  const [nameFile, setNameFile] = useState(
    data?.document_type_name || data?.directory_name || data?.file_name || 'Chưa đặt tên',
  );

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  const handleClick = async (e) => {
    switch (e.detail) {
      case 1:
        if (!isAddFolder) {
          handleActiveChildSection(indexChildSection, data);
          if (Boolean(data?.is_file)) {
            if (informationFileData) {
              await dispatch(fileManager.clearInformationData());
            }
            await dispatch(fileManager.getInformationFile(data?.file_id));
          } else {
            await dispatch(fileManager.clearInformationData());
          }
        }
        break;
      case 2:
        setViewFolder(true);
        dispatch(
          fileManager.getAllItems({
            directory_id: data?.directory_id,
            document_type_id: data?.document_type_id,
          }),
        );
        break;
    }
  };

  const iconLeft = useMemo(() => {
    if (Boolean(data?.file_mime)) {
      return getIcon(data);
    } else {
      return folder;
    }
  }, [data]);

  const handleCreateDir = useCallback(async () => {
    try {
      const dataPost = allItemsArrayColumn[indexColumn - 1]?.parentFolder;
      if (isAddFolder) {
        const params = {
          indexColumn: indexColumn,
          directory_id: null,
          parent_id: dataPost?.directory_id,
          document_type_id: dataPost?.document_type_id,
          directory_name: nameFile,
          is_share_all: 0,
          is_active: 1,
        };
        setAddNew(false);
        await dispatch(fileManager.createDir(params));
        await dispatch(fileManager.getAllItemsReplaceColums({ ...params, directory_id: dataPost?.directory_id }));
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, allItemsArrayColumn, nameFile, indexColumn, isAddFolder, setAddNew]);

  useOutsideClick(ref, () => handleCreateDir, [handleCreateDir]);

  return (
    <Wrapper
      flex={informationFileData ? 'start' : 'space-evenly'}
      ref={ref}
      onClick={(e) => handleClick(e)}
      activeChildSection={activeChildSection}>
      <NameContainer>
        <IconLeft src={iconLeft}></IconLeft>
        <NameChild
          readOnly={readOnly}
          ref={inputRef}
          value={nameFile}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (isAddFolder) {
                handleCreateDir(data);
              }
            }
          }}
          onChange={(e) => {
            setNameFile(e.target.value);
          }}
        />
      </NameContainer>
      {!informationFileData && (
        <>
          <CreateDate>{data?.created_date}</CreateDate>
          <Author>
            {Number.isInteger(parseInt(data?.file_owner || data?.directory_owner)) &&
              `${data?.file_owner || data?.directory_owner} - `}
            {data?.full_name}
          </Author>
          <Icon src={Boolean(data?.is_owner) ? owner : null} />
          <Size>{Boolean(data?.is_directory) ? '⎯' : (data?.file_size / 1000).toFixed(0) + ' KB'}</Size>
        </>
      )}
    </Wrapper>
  );
};

ChildSection.propTypes = {
  data: PropTypes.object,
  isAddFolder: PropTypes.bool,
  indexChildSection: PropTypes.number,
  indexColumn: PropTypes.number,
  handleActiveChildSection: PropTypes.func,
  activeChildSection: PropTypes.number,
  setAddNew: PropTypes.func,
  setViewFolder: PropTypes.func,
};

export default ChildSection;
