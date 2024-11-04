import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import SkillSelectModal from 'pages/Position/components/add/level/modal/skill/SkillSelectModal';
import DataTable from 'components/shared/DataTable/index';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const Wrapper = styled.div``;

// field skill_list follow level_list
const PositionSkillTable = ({ field, disabled }) => {
  const methods = useFormContext();
  const { error } = methods.getFieldState(field, methods.formState);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(undefined);
  const actions = [
    {
      globalAction: true,
      icon: 'fi fi-rr-plus',
      type: 'success',
      permission: 'MD_POSITION_ADD_SKILLS',
      content: 'Thêm kỹ năng',
      hidden: disabled,
      onClick: () => setModal(true),
    },
    {
      icon: 'fi fi-rr-trash',
      color: 'red',
      hidden: disabled,
      permission: 'MD_POSITION_DEL_SKILLS',
      onClick: (_, key) =>
        dispatch(
          showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
            const value = { ...(methods.watch(field) ?? {}) };
            delete value[key];
            methods.setValue(field, value);
          }),
        ),
    },
  ];

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (p, i) => i + 1,
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Kỹ năng',
        formatter: (p) => <b>{p?.skill_name}</b>,
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Nhóm kỹ năng',
        formatter: (p) => p?.skillgroup_name?.join(','),
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trình độ',
        formatter: (_, key) => {
          return (
            <FormSelect
              bordered
              field={`${field}.${key}.skill_level_id`}
              disabled={disabled}
              list={mapDataOptions4SelectCustom(methods.watch(`${field}.${key}`)?.skill_level)}
              validation={{
                required: 'Cần chọn trình độ',
              }}
            />
          );
        },
        classNameHeader: 'bw_text_center',
      },
    ],
    [field, disabled],
  );

  return (
    <Wrapper>
      <div className='bw_col_12 bw_mt_2'>
        <div className='bw_table_responsive bw_mt_1'>
          <DataTable
            title={
              <label>
                Kỹ năng <span className='bw_red'>*</span>
                {error && <ErrorMessage message={error?.message} />}
              </label>
            }
            noSelect
            noPaging
            columns={columns}
            actions={actions}
            data={field ? Object.values(methods.watch(field) ?? {}) : []}
          />
        </div>
      </div>
      {modal && <SkillSelectModal field={field} onClose={() => setModal(false)} />}
    </Wrapper>
  );
};

PositionSkillTable.propTypes = {
  field: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

PositionSkillTable.defaultProps = {
  disabled: false,
};

export default PositionSkillTable;
