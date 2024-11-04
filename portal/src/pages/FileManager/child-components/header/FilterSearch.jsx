import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Input, Button} from 'antd';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import fileManager from 'pages/FileManager/actions/file-manager';
import {CloseOutlined} from '@ant-design/icons';
const {Search} = Input;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const SeacrhStyled = styled(Search)`
  width: 475px !important;
  height: 45px !important;
  margin-right: 13px !important;
  margin-left: 3px !important;
  .ant-input-wrapper {
    height: 100%;
    input {
      display: ${props => (props.hideInput ? 'none' : 'block')};
      background: #f2f2f2;
      height: 100%;
      border-radius: 5px !important;
      transition: width 0.4s ease-in-out;
      outline: 0px;
      border: 0px;
    }
    .ant-input-group-addon {
      position: absolute;
      background-color: transparent !important;
      top: 50% !important;
      left: 90% !important;
      transform: translate(-50%, -50%) !important;
      z-index: 1000;
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 43px !important;
        height: 36px !important;
        border-radius: 7px !important;
        margin-right: 5px !important;
        & > span {
          font-size: 20px;
        }
      }
    }
  }
`;

const ButtonStyled = styled(Button)`
  position: absolute;
  z-index: 10000;
  left: 392px;
  display: flex;
  align-items: center;
  color: red;
  &:hover {
    color: red !important;
    background: rgba(0, 0, 0, 0) !important;
    border-color: transparent !important;
  }
`;

const FilterSearch = ({onChange, onSubmit}) => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState(null);
  const handleSearch = () => {
    if (keyword === '') {
      dispatch(fileManager.hideSearchFunction());
      return;
    }
    dispatch(fileManager.showSearchFunction());
    onSubmit();
  };

  const handleClickHide = () => {
    dispatch(fileManager.hideSearchFunction());
    setKeyword('');
  };

  return (
    <Wrapper>
      {keyword && keyword !== '' && (
        <ButtonStyled onClick={handleClickHide} type="text">
          <CloseOutlined />
        </ButtonStyled>
      )}
      <SeacrhStyled
        value={keyword}
        onChange={e => {
          setKeyword(e.target.value);
          onChange({key_word: e.target.value});
        }}
        placeholder="Tên tài liệu...."
        enterButton
        onSearch={handleSearch}
      />
    </Wrapper>
  );
};

FilterSearch.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

FilterSearch.defaultProps = {
  onChange: () => {},
  onSubmit: () => {},
};

export default FilterSearch;
