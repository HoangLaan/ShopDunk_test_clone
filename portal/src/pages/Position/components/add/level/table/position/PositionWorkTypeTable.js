import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useFormContext } from 'react-hook-form';

import { showConfirmModal } from 'actions/global';

import DataTable from 'components/shared/DataTable';
import WorkTypeSelectModal from 'pages/Position/components/add/level/modal/work-type/WorkTypeSelectModal';
import WorkTypeAddModal from 'pages/Position/components/add/level/modal/work-type/WorkTypeAddModal';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const Wrapper = styled.div``;

const PositionWorkTypeTable = ({ field, disabled }) => {
  const methods = useFormContext();
  const { error } = methods.getFieldState(field, methods.formState);
  const [modalSelectWorkType, setModalSelectWorkType] = useState(false);
  const [modalAddWorkType, setModalAddWorkType] = useState(false);
  const dispatch = useDispatch();
  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        hidden: disabled,
        permission: 'MD_POSITION_ADD_WORKS',
        content: 'Thêm công việc',
        onClick: () => setModalSelectWorkType(true),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        permission: 'MD_POSITION_DEL_WORKS',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
              const value = { ...(methods.watch(field) ?? {}) };
              delete value[d];
              methods.setValue(field, value);
            }),
          ),
      },
    ];
  }, []);

  const columns = [
    {
      header: 'STT',
      formatter: (p, i) => i + 1,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
    },
    {
      header: 'Loại công việc',
      formatter: (p) => <b>{p?.work_type_name}</b>,
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Chuyên môn',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (_, index) => {
        const is_proffessional = methods.watch(`${field}.${index}.is_proffessional`);
        return (
          <label className='bw_checkbox'>
            <label className='bw_checkbox'>
              <input
                disabled={disabled}
                checked={is_proffessional}
                type='checkbox'
                onChange={(_) => {
                  methods.setValue(`${field}.${index}.is_proffessional`, !is_proffessional);
                }}
              />
              <span></span>
            </label>
          </label>
        );
      },
    },
    {
      header: 'Mô tả',
      accessor: 'created_user',
      classNameHeader: 'bw_text_center',
    },
  ];

  useEffect(() => {
    methods.register('level_list');
  }, []);

  return (
    <Wrapper>
      <div className='bw_col_12 bw_mt_2'>
        <div className='bw_table_responsive bw_mt_1'>
          <DataTable
            title={
              <label>
                Loại công việc <span className='bw_red'>*</span>
                {error && <ErrorMessage message={error?.message} />}
              </label>
            }
            noSelect
            noPaging
            columns={columns}
            actions={actions}
            data={field ? Object.values(methods.watch(`${field}`) ?? {}) : []}
          />
        </div>
      </div>

      {modalSelectWorkType && (
        <WorkTypeSelectModal
          field={field}
          handleAddWorkType={() => {
            setModalSelectWorkType(false);
            setModalAddWorkType(true);
          }}
          onClose={() => {
            setModalSelectWorkType(false);
          }}
        />
      )}
      {modalAddWorkType && (
        <WorkTypeAddModal
          onClose={() => {
            setModalAddWorkType(false);
            setModalSelectWorkType(true);
          }}
        />
      )}
    </Wrapper>
  );
};

export default PositionWorkTypeTable;
