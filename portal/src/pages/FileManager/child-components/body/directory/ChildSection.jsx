/* eslint-disable */
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import folder from 'pages/FileManager/assets/folder.svg';
import fileManager from 'pages/FileManager/actions/file-manager';
import useOutsideClick from 'hooks/use-outside-picker';
import { RightOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getIcon } from 'pages/FileManager/utils/helper';
import { Tooltip } from 'antd';
import ColorTagHandle from '../quick/ColorTagHandle';
import { showToast } from 'utils/helpers';

const Wrapper = styled.div`
  width: 100%;
  height: 45px;
  background: ${(props) => (props.activeChildSection ? '#F6F6F6' : 'white')};
  border-left: ${(props) => (props.activeChildSection ? '5px solid #2f80ed!important' : '')};
  display: flex;
  align-items: center;
  font-size: 15px !important;
  cursor: pointer;
  position: relative;
  //;border-radius: 5px;
`;

const IconLeft = styled.img`
  width: 19px;
  margin-left: 19px;
`;

const RightContainer = styled.span`
  display: flex;
`;

const IconRight = styled(RightOutlined)`
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    font-size: 11px;
  }
`;

const NameChild = styled.input`
  color: #222b3c;
  outline: 0px;
  font-size: 15px;
  margin-left: 13px;
  width: 100%;
  border: 0px;
  cursor: pointer;
  background-color: transparent;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ChildSection = ({
  data,
  dataActive,
  // name,
  // isFile,
  // isTypeDocument,
  isAddFolder,

  indexChildSection,
  indexColumn,

  handleActiveChildSection,
  activeChildSection,
  setAddNew,
  onRefresh,
  setDataActive,
}) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [disableOnClick, setDisableOnClick] = useState(false);
  const { allItemsArrayColumn, informationFileData, selectedFile } = useSelector((state) => state.fileManager);
  const inputRef = useRef(data);
  const [readOnly, setReadOnly] = useState(!isAddFolder);
  const [nameFile, setNameFile] = useState(data?.document_type_name || data?.directory_name || data?.file_name);
  const [defaultValue, setDefaultValue] = useState(activeChildSection ? dataActive : data);

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  useEffect(() => {
    if (activeChildSection) {
      setDefaultValue(() => dataActive);
      if (dataActive?.is_file) {
        setNameFile(dataActive?.file_name);
      } else if (data?.is_directory) {
        setNameFile(dataActive?.directory_name);
      } else {
        setNameFile(dataActive?.document_type_name);
      }
    }
  }, [activeChildSection, dataActive]);

  const handleClick = async () => {
    if (!isAddFolder && !disableOnClick) {
      handleActiveChildSection(indexChildSection, defaultValue);
      await dispatch(fileManager.deleteItemColumns(indexColumn));
      if (Boolean(data?.is_file)) {
        await dispatch(fileManager.getInformationFile(data?.file_id));
      } else {
        await dispatch(
          fileManager.getAllItemsColumns({
            itemsPerPage: 500,
            page: 1,
            document_type_id: data?.document_type_id,
            directory_id: data?.directory_id,
          }),
        );
      }
    }
  };

  const iconLeft = useMemo(() => {
    if (Boolean(data?.file_mime)) {
      return getIcon(data);
    } else {
      return folder;
    }
  }, [data]);
  console.log(allItemsArrayColumn);
  const handleCreateDir = useCallback(async () => {
    try {
      if (!Boolean(nameFile.trim()) || !Boolean(nameFile)) {
        showToast.error('Vui lòng đặt tên thư mục');
        return;
      }
      const dataPost = allItemsArrayColumn[indexColumn - 1]?.parentFolder;

      if (isAddFolder) {
        const params = {
          indexColumn: indexColumn,
          directory_id: null,
          parent_id: dataPost?.directory_id,
          document_type_id: dataPost?.document_type_id,
          directory_name: nameFile.trim(),
          is_share_all: 0,
          is_active: 1,
        };
        setAddNew(false);
        await dispatch(fileManager.createDir(params));
        await dispatch(fileManager.getAllItemsReplaceColums({ ...params, directory_id: dataPost?.directory_id }));
      }
    } catch (error) {
      console.log(_);
    }
  }, [dispatch, allItemsArrayColumn, nameFile]);

  useEffect(() => {
    if (activeChildSection && allItemsArrayColumn.length === indexColumn) {
      setDefaultValue((prev) => ({
        ...prev,
        list_tag: selectedFile?.list_tag,
      }));
    }
  }, [activeChildSection, selectedFile, indexColumn]);

  const jsx_render = useCallback(() => {
    return (
      <ColorTagHandle
        data={defaultValue}
        setDefaultValue={(e) => {
          setDefaultValue(e);
          if (activeChildSection) {
            setDataActive(e);
            dispatch(fileManager.selectedFile(e));
          }
        }}
        setDisableOnClick={setDisableOnClick}
        onRefresh={onRefresh}
        // setDataActive={setDataActive}
      />
    );
  }, [defaultValue, setDefaultValue, setDataActive, activeChildSection, onRefresh, setDisableOnClick, selectedFile]);

  useOutsideClick(
    ref,
    () => {
      if (isAddFolder) {
        if (nameFile && nameFile.trim() !== '') {
          handleCreateDir(data);
        } else {
          setAddNew(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (activeChildSection && informationFileData && informationFileData[0]?.file_id === defaultValue?.file_id) {
      setDefaultValue({
        ...defaultValue,
        list_tag: informationFileData[0]?.list_tag,
      });
    }
  }, [informationFileData, activeChildSection]);

  return (
    <Wrapper ref={ref} onClick={() => handleClick()} activeChildSection={activeChildSection}>
      <IconLeft src={iconLeft}></IconLeft>
      <Tooltip placement='topLeft' title={nameFile}>
        <NameChild
          placeholder='Đặt tên thư mục'
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
      </Tooltip>
      <RightContainer>
        {Boolean(defaultValue?.list_tag?.length) && !isAddFolder && jsx_render()}
        {Boolean(data?.is_directory) && <IconRight></IconRight>}
      </RightContainer>
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
};

export default ChildSection;
