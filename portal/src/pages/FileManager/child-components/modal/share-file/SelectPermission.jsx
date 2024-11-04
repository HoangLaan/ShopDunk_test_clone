import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import arrow from 'pages/FileManager/assets/arrow.svg';
import {PERMISSION} from 'pages/FileManager/utils/constants';

const Wrapper = styled.div`
  padding: 10px 0;
  width: 150px;
  position: ${props => (props.absolute ? 'absolute' : null)};
  top: ${props => (props.absolute ? '5px' : null)};
  right: ${props => (props.absolute ? '122px' : null)};
  .section {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 5px 0;
  }
  .left-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: right;
    margin-right: 10px;
  }
  .select-header {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: left;
    position: relative;
    .select-list {
      width: 200px;
      position: absolute;
      padding: 12px;
      top: 30px;
      background-color: white;
      border-top: 2px solid #ccc;
      z-index: 10;
      box-shadow: 0px 6px 5px 0px;
    }
  }
  .ant-select-selector {
    border-radius: 4px;
  }
`;

const IconSelect = styled.img`
  transform: rotate(90deg);
`;

const SelectPermission = ({options, valuePermission, absolute, onChange}) => {
  const [permission, setPermission] = useState(valuePermission || PERMISSION.VIEW);
  const [activeSelect, setActiveSelect] = useState(false);

  return (
    <Wrapper absolute={absolute}>
      <div className="select-header" onClick={() => setActiveSelect(prev => !prev)}>
        <div className="left-header">
          <span style={{marginRight: '7px'}}>{options.find(_ => _.key === permission)?.label}</span>
          <IconSelect src={arrow}></IconSelect>
        </div>
        {activeSelect && (
          <div className="select-list">
            {options.map(({key, value, label}) => (
              <div key={key} className="section">
                <span
                  onClick={() => {
                    if (!(PERMISSION.UNPERMISSION === key)) {
                      setPermission(key);
                    }
                    onChange(key);
                  }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

SelectPermission.propTypes = {
  valuePermission: PropTypes.object,
  absolute: PropTypes.bool,
  onChange: PropTypes.func,
};

export default SelectPermission;
