import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useFormContext, FormProvider } from 'react-hook-form';

import { mapDataOptions4Select } from 'utils/helpers';

import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import PositionLevelTable from './table/position/PositionSkillTable';
import PositionWorkTypeTable from './table/position/PositionWorkTypeTable';
import PositionJdFile from './PositionJdFile';
import { getOptionsPositionLevel } from 'services/position-level.service';

const Wrapper = styled.div`
  margin-top: 15px;
`;

const PositionLevelSection = ({ field, disabled }) => {
  const methods = useFormContext();
  const { experienceData, salaryData, levelData } = useSelector((state) => state.global);

  const level_list = Object.values(methods.watch('level_list')) ?? [];
  const hr_level_id = methods.watch(`${field}.hr_level_id`);
  const [listLevelsOptions, setListLevelsOptions] = useState();

  useEffect(() => {
    async function loadLevelList() {
      const res = await getOptionsPositionLevel();
      setListLevelsOptions(res);
    }
    loadLevelList();
  }, []);
  useEffect(() => {
    methods.register(`${field}.skill_list`, {
      validate: (value) => {
        if (!value || value?.length === 0) {
          return 'Kỹ năng là bắt buộc';
        }

        return true;
      },
    });

    methods.register(`${field}.work_type_list`, {
      validate: (value) => {
        if (!value || value?.length === 0) {
          return 'Loại công việc là bắt buộc';
        }

        return true;
      },
    });
  }, [methods, field]);

  return (
    <FormProvider {...methods}>
      <Wrapper className='mt-3 bw_row'>
        <div className='bw_col_4'>
          <FormItem isRequired label='Cấp bậc'>
            <FormSelect
              disabled={disabled}
              type='text'
              field={`${field}.hr_level_id`}
              placeholder='Chọn tên cấp bậc'
              list={mapDataOptions4Select(listLevelsOptions)}
              validation={{
                required: 'Tên cấp bậc là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Số năm kinh nghiệm'>
            <FormSelect
              showSearch
              disabled={disabled}
              type='text'
              field={`${field}.experience_id`}
              placeholder='Số năm kinh nghiệm'
              list={mapDataOptions4Select(experienceData)}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Mức lương trong khoảng'>
            <FormSelect
              disabled={disabled}
              type='text'
              field={`${field}.salary_id`}
              placeholder='Lương'
              list={mapDataOptions4Select(salaryData)}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <PositionJdFile field={`${field}`} disabled={disabled} />
          <PositionLevelTable field={`${field}.skill_list`} disabled={disabled} />
          <PositionWorkTypeTable field={`${field}.work_type_list`} disabled={disabled} />
        </div>
      </Wrapper>
    </FormProvider>
  );
};

PositionLevelSection.propTypes = {
  field: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

PositionLevelSection.defaultProps = {
  disabled: false,
};

export default PositionLevelSection;
