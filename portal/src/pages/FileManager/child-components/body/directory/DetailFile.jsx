/* eslint-disable */
import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import {ArrowDownOutlined, LoadingOutlined, TagsOutlined, DownOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Tooltip} from 'antd';
import fileManager from 'pages/FileManager/actions/file-manager';
import {getIcon} from 'pages/FileManager/utils/helper';
import TagSelect from 'pages/FileManager/child-components/body/dropdown/TagSelect';
import {Spin} from 'antd';
import ColorTagHandle from '../quick/ColorTagHandle';

const Wrapper = styled.div`
  min-width: 25% !important;
  height: ${props => props.height ?? '100%'} !important;
  overflow-y: scroll;
  background-color: white;
  margin-right: 5px !important;
  position: sticky;
  top: 0;
  left: 0;
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

const TypeIconFile = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
`;

const NameFile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  .left {
    width: 85%;
    h5 {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-bottom: 0rem !important;
    }
  }
  h3 {
    margin-bottom: 0.1rem !important;
  }
`;

const InformationDetail = styled.div`
  padding: 20px;
  .row {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: 15px;
    }
    border-bottom: 1px solid #ccc;
  }
`;

const ImgStyled = styled.img`
  width: 200px !important;
`;

const ButtonStyled = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LIST_DETAIL = {
  SIZE: 'SIZE',
  FILE_SIZE: 'FILE_SIZE',
  CREATED_USER: 'CREATED_USER',
  CREATED_DATE: 'CREATED_DATE',
  UPDATED_USER: 'UPDATED_USER',
  UPDATED_DATE: 'UPDATED_DATE',
  LIST_TAGS: 'LIST_TAGS',
};

const DetailFile = ({height}) => {
  const dispatch = useDispatch();
  const {informationFileData, getInformationFileDataLoading, dowloadFileLoading, selectedFile} = useSelector(
    state => state.fileManager,
  );

  const handleDowload = useCallback(() => {
    dispatch(fileManager.dowloadFile(informationFileData[0]));
  }, [informationFileData]);
  const data = useMemo(() => informationFileData[0], []);
  const handleRefresh = useCallback(async () => {
    if (data?.file_id) await dispatch(fileManager.getInformationFile(data?.file_id));
  }, [dispatch, data]);

  const fileName = `${data?.file_name}.${data?.file_ext}`;

  const imgFile = useMemo(() => getIcon(data), [data]);
  const icon = useMemo(() => (dowloadFileLoading ? <LoadingOutlined /> : <ArrowDownOutlined />), [dowloadFileLoading]);

  const listDetail = useMemo(
    () => [
      {
        key: LIST_DETAIL.SIZE,
        label: 'Size',
        value: (data?.file_size / 1000).toFixed(0) + ' KB',
      },
      {
        key: LIST_DETAIL.CREATED_DATE,
        label: 'Ngày tạo',
        value: data?.created_date,
      },
      {
        key: LIST_DETAIL.CREATED_USER,
        label: 'Người tạo',
        value: data?.created_user,
      },
      {
        key: LIST_DETAIL.UPDATED_DATE,
        label: 'Ngày chỉnh sửa',
        value: data?.updated_date,
      },
      {
        key: LIST_DETAIL.UPDATED_USER,
        label: 'Người chỉnh sửa',
        value: data?.updated_user,
      },
      {
        key: LIST_DETAIL.LIST_TAGS,
        label: 'Thẻ nhãn',
        value: (
          <span style={{display: 'inline-flex', alignItems: 'center'}}>
            <ColorTagHandle data={selectedFile} />
            <TagSelect
              defaultData={selectedFile}
              isDetailFile
              hideListTag
              topAbsolute="-47px"
              boderStyled="none"
              onRefesh={handleRefresh}
              nodeButton={<DownOutlined style={{fontSize: '12px', marginBottom: '8px', marginLeft: '4px'}} />}
            />
          </span>
        ),
      },
    ],
    [selectedFile],
  );

  return (
    <Wrapper id="detail-file-fm" height={height}>
      {getInformationFileDataLoading && <Spin />}
      {!getInformationFileDataLoading && (
        <>
          <TypeIconFile>
            <ImgStyled src={imgFile} />
          </TypeIconFile>
          <NameFile>
            <div className="left">
              <Tooltip title={fileName}>
                <h5>{fileName}</h5>
              </Tooltip>
            </div>
            <div className="right">
              <Tooltip title="Tải xuống">
                <ButtonStyled onClick={handleDowload} size="large" type="primary" shape="circle" icon={icon} />
              </Tooltip>
            </div>
          </NameFile>
          <InformationDetail>
            {listDetail?.map(
              ({key, label, value}) =>
                value && (
                  <div key={key} className="row">
                    <span>{label}:</span>
                    <span>{value}</span>
                  </div>
                ),
            )}
          </InformationDetail>
        </>
      )}
    </Wrapper>
  );
};

export default DetailFile;
