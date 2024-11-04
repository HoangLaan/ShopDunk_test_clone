import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion';
import ModalStaff from './Modal/ModalStaff';
import DataTable from 'components/shared/DataTable/index';

const ReceiverTable = ({ disabled }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { watch, register } = methods;
  useEffect(() => {
    register('receivers');
  }, [register]);
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        accessor: '',
        classNameHeader: ' bw_name_sticky',
        classNameBody: ' bw_name_sticky',
        formatter: (_, keyRender) => keyRender + 1,
      },
      {
        header: 'Họ và tên',
        accessor: 'full_name',
        classNameHeader: ' bw_name_sticky',
        classNameBody: ' bw_name_sticky',
      },
      {
        header: 'Chức vụ',
        accessor: 'position_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Phòng ban',
        accessor: 'department_name',
        classNameHeader: ' bw_name_sticky',
        classNameBody: ' bw_name_sticky',
      },
    ],
    [],
  );
  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        disabled: disabled,
        onClick: () => setOpen(true),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: disabled,
        onClick: (item, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                methods.setValue(
                  'receivers',
                  watch('receivers').filter((e) => !(e.user_id === item.user_id)),
                );
              },
            ),
          ),
      },
    ];
  }, []);
  return (
    <BWAccordion title='Người nhận thông tin'>
      {/* {!disabled && (
        <a onClick={() => setOpen(true)} className='bw_btn_outline bw_btn_outline_success bw_mb_2'>
          <span className='fi fi-rr-plus'></span> Thêm nhân viên
        </a>
      )}
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
            <th>Họ và tên</th>
            <th className='bw_text_center'>Chức vụ</th>
            <th className='bw_text_center'>Phòng ban</th>
            {!disabled && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
          </thead>
          <tbody>
            {watch('receivers')?.map((p, key) => {
              return (
                <tr key={key}>
                  <td className='bw_sticky bw_text_center'>{key + 1}</td>
                  <td className='bw_text_center'>{p?.full_name}</td>
                  <td className='bw_text_center'>{p?.department_name}</td>
                  <td className='bw_text_center'>{p?.position_name}</td>
                  {!disabled && (
                    <td className='bw_sticky bw_action_table bw_text_center'>
                      <a
                        onClick={() => {
                          dispatch(
                            showConfirmModal(
                              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                              async () => {
                                methods.setValue(
                                  'receivers',
                                  watch('receivers').filter((e) => !(e.user_id === p.user_id)),
                                );
                              },
                            ),
                          );
                        }}
                        className='bw_btn_table bw_delete bw_red'>
                        <i className='fi fi-rr-trash'></i>
                      </a>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}
      <DataTable
        selectedHidden
        hiddenDeleteClick
        actions={actions}
        columns={columns}
        noSelect
        selectable
        data={watch('receivers')}
        noPaging
      />
      {open && (
        <ModalStaff
          open={open}
          onClose={() => setOpen(false)}
          onApply={(data) => methods.setValue('receivers', data)}
          defaultDataSelect={methods.watch('receivers')}></ModalStaff>
      )}
    </BWAccordion>
  );
};

export default ReceiverTable;
