import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';
import { Empty } from 'antd';

const LoadingOutlinedStyled = styled(LoadingOutlined)`
  color: var(--blueColor);
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 30px;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const TableStyed = styled.table`
  thead th {
    border: solid 1px var(--grayColor);
  }

  .bw_bold {
    font-weight: bold;
  }

  .bw_highlight {
    // background-color: var(--mainColor);
    background-color: antiquewhite;
  }

  .bw_radio,
  .bw_checkbox,
  .bw_radio span,
  .bw_checkbox span {
    margin: 0;
  }
`;

const CapacityTabble = ({ loading, disabled, skillList, setSkillList, levelList }) => {
  const colSpan = useMemo(() => {
    return 2 + (levelList?.length ? levelList.length : 1);
  }, [levelList]);

  const [levelRender,setLevelRender]=useState([]);
  const [levelIdList, setLevelIdList]=useState([]);


  useEffect(()=>{
    const extractedLevels = skillList?.map((valueRender, keyRender) => valueRender.levels)
    const allLevels = extractedLevels?.flat();
    setLevelIdList(allLevels);

  },[skillList])
  useEffect(()=>{
    let listLevelRender = [];
    levelList?.map((level, keyLevel) => {
      if(levelIdList.includes(level.level_id)){
        listLevelRender.push(level)
      }
      setLevelRender(listLevelRender)
    })
  },[levelIdList])
  const romanize = useCallback((num) => {
    var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 },
      roman = '',
      i;
    for (i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  }, []);

  const renderData = useCallback(() => {
    let parentCount = 0;
    let childCount = 0;

    return skillList?.map((valueRender, keyRender) => {
      if (valueRender.skill_id) {
        childCount++;
        return (
          <tr key={`${keyRender}`}>
            <td className='bw_text_center'>{childCount}</td>

            <td>{valueRender.skill_name}</td>

            {levelRender?.map((level, keyLevel) => {
              if (valueRender.levels.includes(level.level_id)) {
                return (
                  <td
                    key={`${keyRender}-${keyLevel}`}
                    className={`bw_text_center ${
                      level.level_id === valueRender.required_level_id ? 'bw_highlight' : ''
                    }`}>
                    <label className='bw_radio'>
                      <input
                        disabled={disabled}
                        type='radio'
                        name={`skill_list-${keyRender}`}
                        value={level.level_id}
                        style={{ lineHeight: '1' }}
                        checked={level.level_id === valueRender.level_id}
                        onChange={(e) => {
                          setSkillList((prevState) => {
                            prevState[keyRender].level_id = +e.target.value;
                            return [...prevState];
                          });
                        }}
                      />
                      <span></span>
                    </label>
                  </td>
                );
              }

              return <td key={`${keyRender}-${keyLevel}`} className='bw_text_center'></td>;
            })}
          </tr>
        );
      }

      parentCount++;
      childCount = 0;

      return (
        <tr key={keyRender}>
          <td className='bw_text_center bw_bold'>{romanize(parentCount)}</td>

          <td className='bw_bold'>{valueRender.skill_group_name}</td>

          <td colSpan={levelRender?.length}></td>
        </tr>
      );
    });
  }, [skillList, setSkillList, romanize, levelRender, disabled]);

  const jsx_tbody =
    skillList?.length > 0 ? (
      <tbody>{renderData()}</tbody>
    ) : (
      <tbody>
        <tr>
          <td colSpan={colSpan}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
          </td>
        </tr>
      </tbody>
    );

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <div className='bw_box_card bw_mt_2'>
          <div className='bw_table_responsive'>
            <TableStyed className='bw_table'>
              <thead>
                <tr>
                  <th className='bw_text_center' rowSpan='2'>
                    STT
                  </th>

                  <th className='bw_text_center' rowSpan='2'>
                    Kỹ năng
                  </th>

                  <th className='bw_text_center' colSpan={levelRender?.length}>
                    Trình độ kỹ năng
                  </th>
                </tr>

                <tr>
                  {levelRender?.map((level, idx) => (
                    <th key={`${idx}`} className='bw_text_center'>
                      {level.level_name}
                    </th>
                  ))}
                </tr>
              </thead>

              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={colSpan}>
                      <LoadingOutlinedStyled />
                    </td>
                  </tr>
                </tbody>
              ) : (
                jsx_tbody
              )}
            </TableStyed>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

CapacityTabble.propTypes = {
  /** Indicate table's loading state */
  loading: PropTypes.bool,
};

CapacityTabble.defaultProps = {
  loading: false,
};

export default CapacityTabble;
