import BWAccordion from 'components/shared/BWAccordion/index';
import React, { useMemo, useState } from 'react';
import lodash from 'lodash';
import PositionLevelSection from './level/PositionLevelSection';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { showToast } from 'utils/helpers';

const IconStyled = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const PositionLevelTab = ({ disabled }) => {
  const methods = useFormContext();
  const { levelData } = useSelector((state) => state.global);
  const [currentObject, setCurrentObject] = useState(0);

  const level_list = methods.watch('level_list');
  const parseLevelList = useMemo(() => Object.values(level_list ?? {}), [level_list]);

  return (
    <BWAccordion title={'Cấp bậc'}>
      {!disabled && (
        <a
          onClick={() => {
            if (levelData.length <= parseLevelList.length) {
              showToast.error('Số cấp bậc đã tối đa!', {
                position: 'top-right',
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'colored',
              });
              return;
            }
            methods.setValue(
              'level_list',
              Object.assign(level_list, {
                [parseLevelList.length]: {
                  hr_level_id: undefined,
                  experience_id: undefined,
                  salary_id: undefined,
                },
              }),
            );
            setCurrentObject(parseLevelList.length);
          }}
          className='bw_btn bw_btn_success bw_add_level bw_mt_1'>
          <IconStyled className='fi fi-rr-plus'></IconStyled>Thêm Cấp bậc
        </a>
      )}
      <ul className='bw_tabs'>
        {(parseLevelList ?? []).map((_, index) => {
          return (
            <li key={index} className={currentObject === index ? 'bw_active' : ''}>
              <a
                onClick={() => {
                  setCurrentObject(index);
                }}
                className='bw_link'>
                Cấp {index + 1}
              </a>{' '}
              {!disabled && (
                <span
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (parseLevelList.length === 1) {
                      showToast.error('Hiện tại chỉ còn 1 cấp độ! Không thể xoá', {
                        position: 'top-right',
                        autoClose: 1000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        theme: 'colored',
                      });
                      return;
                    } else {
                      if (currentObject === index) {
                        if (currentObject === 0) {
                          setCurrentObject(1);
                        } else {
                          setCurrentObject(currentObject - 1);
                        }
                      }
                    }
                    let _level_list = lodash.cloneDeep(level_list);
                    lodash.unset(_level_list, index);
                    methods.setValue('level_list', Object.assign(Object.values(_level_list)));
                    setCurrentObject(index - 1);
                  }}
                  className='bw_remove_tabs'>
                  <i
                    className='fi fi-rr-cross'
                    style={{
                      fontSize: '11px',
                    }}></i>
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {Boolean(parseLevelList.length) && currentObject >= 0 && level_list[currentObject] && (
        <PositionLevelSection disabled={disabled} field={`level_list.${currentObject}`} />
      )}
    </BWAccordion>
  );
};

PositionLevelTab.propTypes = {
  disabled: PropTypes.bool,
};

PositionLevelTab.defaultProps = {
  disabled: false,
};

export default PositionLevelTab;
