import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

const Select = styled.div`
  width: ${props => props.width ?? '307px'};
  height: 50px;
  margin-left: 30px;
  position: relative;

  .dropdown-select {
    width: 100% !important;
    height: 100%;
    padding: 1rem;
    border-radius: 4px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.6rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 80%;
    .select {
      width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .dropdown-list {
    border-radius: 4px;
    background-color: white;
    position: absolute;
    height: 50vh;
    overflow: scroll;
    top: 86%;
    left: 0;
    right: 0;
    opacity: 1;
    visibility: visible;
    transition: opacity 0.2s linear, visibility 0.2s linear;
    transform: translateY(10px);
  }
  .dropdown-list__item {
    height: 50px;
    padding: 0.5rem 1rem;
    font-size: 1.4rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const SelectItem = ({ value, options, width, placeholder, onChange }) => {
  const outSiteRef = React.useRef();
  const [valueSelect, setValueSelect] = React.useState(value);
  const [visibility, setVisibility] = React.useState(false);
  const handleClickOutside = e => {
    if (!outSiteRef.current.contains(e.target)) {
      setVisibility(false);
    }
  };
  const textValue = React.useMemo(() => options.find(_ => _.value === valueSelect)?.text ?? placeholder, [valueSelect]);
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });
  return (
    <Select ref={outSiteRef} width={width}>
      <div onClick={() => setVisibility(!visibility)} className="dropdown-select">
        <div className="select">{textValue}</div>
        {visibility ? <DownOutlined style={{ fontSize: '13px' }} /> : <RightOutlined style={{ fontSize: '13px' }} />}
      </div>
      {visibility && (
        <div className="dropdown-list">
          {options.length > 0 ? (
            options.map(({ key, text, value }) => (
              <div
                key={key}
                onClick={() => {
                  setValueSelect(text);
                  setVisibility(false);
                  onChange(value);
                }}
                className="dropdown-list__item">
                {text}
              </div>
            ))
          ) : (
            <div onClick={() => setVisibility(false)} className="dropdown-list__item">
              Không có lựa chọn nào
            </div>
          )}
        </div>
      )}
    </Select>
  );
};

SelectItem.propTypes = {
  //modal
  width: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType('string', 'number'),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType('string', 'number'),
      value: PropTypes.oneOfType('string', 'number'),
      text: PropTypes.string,
    }),
  ),
  onChange: PropTypes.func,
};

SelectItem.defaultProps = {
  //modal
  width: '307px',
  placeholder: 'Lựa chọn thích ',
  value: undefined,
  options: [],
  onChange: () => {},
};

export default SelectItem;
