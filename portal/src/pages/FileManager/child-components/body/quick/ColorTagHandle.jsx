import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import fileManager from 'pages/FileManager/actions/file-manager';
import { useDispatch } from 'react-redux';

const ColorTag = styled.div`
  width: 50px;
  display: flex;
  flex-direction: row-reverse;
  justify-content: ${(props) => (props.isfile ? 'center' : 'end')};
`;

const Circle = styled.div`
  height: 10px;
  width: 10px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: -6px;
  &:first-child {
    margin-right: 0px;
  }
`;

const CircleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const CircleTooltip = styled.div`
  height: 20px;
  width: 20px;
  background-color: ${(props) => props?.color};
  border-radius: 50%;
  margin-right: 4px;
  cursor: pointer;
  span {
    display: none !important;
    margin-top: 3px !important;
  }
  &:hover {
    span {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
  }
`;

const ColorTagHandle = ({ data, isDetailFile, setDisableOnClick, setDefaultValue, onRefresh }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(undefined);
  const [listTag, setListTag] = useState([]);

  useEffect(() => {
    if (data) {
      setListTag(data?.list_tag);
    }
  }, [data]);

  const handleRefresh = async () => {
    try {
      if (!isDetailFile) {
        let value;
        if (Boolean(data?.is_directory)) {
          value = await fileManager.getInformationDirectoryWithOutDispatch(data?.directory_id);
        } else {
          value = await fileManager.getInformationFileWithOutDispatch(data?.file_id);
        }
        setListTag(value[0]?.list_tag);
        setDefaultValue({
          ...data,
          list_tag: value[0]?.list_tag,
        });
        dispatch(
          fileManager.selectedFile({
            ...data,
            list_tag: value[0]?.list_tag,
          }),
        );
      } else {
        onRefresh();
      }
    } catch (_) {}
  };

  const handleTag = async (_) => {
    let params;
    let type;
    if (Boolean(data?.is_directory)) {
      params = {
        file_tag_id: value?.file_tag_id,
        directory_id: data?.directory_id,
        is_tag: 0,
      };
      type = 'tag-dir';
    } else {
      params = {
        file_tag_id: value?.file_tag_id,
        file_id: data?.file_id,
        is_tag: 0,
      };
      type = 'tag-file';
    }
    await dispatch(fileManager.postTag(params, type));
    handleRefresh();
    setDisableOnClick(false);
  };

  const cirlcle = (
    <div style={{ height: '40px' }}>
      <CircleContainer>
        {(listTag || [])?.map((e, i) => {
          return (
            <CircleTooltip
              onClick={handleTag}
              onMouseOver={(_) => {
                setValue(e);
                setDisableOnClick(true);
              }}
              color={e?.color}
              onMouseOut={(_) => {
                setValue(undefined);
                setDisableOnClick(false);
              }}
              className='circle'>
              <CloseOutlined />
            </CircleTooltip>
          );
        })}
      </CircleContainer>
      <span
        style={{
          textAlign: 'center',
          width: '100%',
          color: 'grey',
          display: 'flex',
          justifyContent: 'center',
        }}>
        {value?.file_tage_name || ''}
      </span>
    </div>
  );
  return listTag && listTag?.length > 0 ? (
    <Tooltip title={cirlcle} color='white' key='grey' placement='topRight'>
      <ColorTag isfile={Boolean(data?.is_file)}>
        {(listTag ?? [])?.map((e, i) => {
          return <Circle key={i} color={e?.color} className='circle'></Circle>;
        })}
      </ColorTag>
    </Tooltip>
  ) : (
    <></>
  );
};

ColorTagHandle.propTypes = {
  data: PropTypes.object,
  setDisableOnClick: PropTypes.func,
  setDefaultValue: PropTypes.func,
};

ColorTagHandle.defaultProps = {
  setDisableOnClick: () => {},
  setDefaultValue: () => {},
};

export default ColorTagHandle;
