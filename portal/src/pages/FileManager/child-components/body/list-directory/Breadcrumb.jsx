import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Tooltip, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import fileManager from 'pages/FileManager/actions/file-manager';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const BreadcrumbStyled = styled.div`
  margin: 10px 0;
  display: inline-flex;
  align-items: center;
  span {
    display: flex;
    align-items: center;
  }
  .arrow {
    display: block;
  }
  span:last-child {
    .arrow {
      display: none;
    }
  }
  .section {
    cursor: pointer;
    width: 155px;
    height: 36px;
    text-align: center;
    padding: 5px;
    font-size: 21px;
    padding: 2px;
    border: 1px dashed #ccc;
    display: inline;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    transition: width 2s;
    &:hover {
      color: white;
      background-color: #3f3f81;
      transition: width 2s;
    }
  }
`;

const ButtonStyled = styled(Button)`
  border: 0px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
`;

const BreadcrumbDirectory = ({ setViewFolder }) => {
  const dispatch = useDispatch();
  const { allItemsList } = useSelector((state) => state.fileManager);
  const pathBreadcrumb = useMemo(() => allItemsList?.pathItems?.reverse(), [allItemsList]);
  return (
    <>
      <BreadcrumbStyled>
        <ButtonStyled onClick={setViewFolder} icon={<ArrowLeftOutlined />}>
          Trở lại trang tìm kiếm
        </ButtonStyled>
        {pathBreadcrumb?.map((value) => (
          <Tooltip
            onClick={() =>
              dispatch(
                fileManager.getAllItems({
                  directory_id: value?.directory_id,
                  document_type_id: value?.document_type_id,
                }),
              )
            }
            style={{ display: 'flex', alignTtems: 'center' }}
            title={value?.directory_name}>
            <div className='section'>{value?.directory_name}</div>
            <span className='arrow'>
              <ArrowRightOutlined />
            </span>
          </Tooltip>
        ))}
      </BreadcrumbStyled>
    </>
  );
};

BreadcrumbDirectory.propTypes = {
  setViewFolder: PropTypes.func,
};

BreadcrumbDirectory.defaultProps = {
  setViewFolder: () => {},
};

export default BreadcrumbDirectory;
