import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getOptionsDepartment } from 'services/department.service';
import { Alert } from 'antd';
import { mapDataOptions4Select } from 'utils/helpers';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import { showConfirmModal } from 'actions/global';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useDispatch } from 'react-redux';
import { getListUserOpts } from 'services/users.service';

const msgError = {
  process_step_name: { required: 'Tên bước bảo hành là bắt buộc' },
  process_step_code: { required: 'Mã bước bảo hành là bắt buộc' },
  color: { required: 'Màu sắc là bắt buộc' },
  model_error: ['Bạn có thật sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
};

const ShiftReviewTable = ({ id, title, disabled, isEdit }) => {
  const methods = useFormContext();

  const {
    formState: { errors },
    watch,
  } = methods;

  const dispatch = useDispatch();

  const [departmentOpts, setDepartmentOpts] = useState([]);

  const getInit = useCallback(async () => {
    // Lấy danh sách phòng ban
    const _departmentOpts = await getOptionsDepartment();

    setDepartmentOpts(mapDataOptions4Select(_departmentOpts));
  }, []);

  useEffect(() => {
    // Load danh sách loại yêu cầu
    getInit();
  }, []);

  const handleDelete = (idx) => {
    let _shift_review = methods.watch('shift_review') || [];

    _shift_review.splice(idx, 1);

    methods.setValue('shift_review', _shift_review);
  };

  const fetchUserOpts = (department_id) => {
    return getListUserOpts({
      department_id: department_id,
      itemsPerPage: 100,
    }).then((body) => {
      const _userOpts = body.items?.map((user) => ({
        label: user.user_name + '-' + user.full_name,
        value: user.user_name,
      }));

      return _userOpts;
    });
  };

  const handleChangeReviewShift = async (idx, key, value) => {
    let _shift_review = methods.watch('shift_review');

    // Kiểm tra nếu là key thay đổi là department_id thì lấy danh sách nhân viên thuộc department đó
    if (key === 'department_id') {
      let _userOpts = await fetchUserOpts(value);

      _shift_review[idx].users = _userOpts;
    }

    _shift_review[idx][key] = value;

    methods.setValue('shift_review', _shift_review);
  };

  const handleAddReviewShitf = () => {
    let shift_review = methods.watch('shift_review') || [];

    shift_review.push({
      department_id: null,
      user_review: [],
    });

    methods.setValue('shift_review', shift_review);
  };

  useEffect(() => {
    if (isEdit) {
      let list_shift_review = methods.watch('shift_review');
      for (const idx in list_shift_review) {
        handleChangeReviewShift(idx, 'department_id', list_shift_review[idx].department_id);
      }
    }
  }, [isEdit]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        styleHeader: { width: '7%' },
        classNameHeader: 'bw_sticky  bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, idx) => <b className='bw_sticky bw_name_sticky'>{idx + 1}</b>,
      },

      {
        header: 'Phòng ban',
        styleHeader: { width: '30%' },
        formatter: (p, idx) => (
          <FormSelect
            value={methods.watch(`shift_review.${idx}.department_id`)}
            list={departmentOpts?.map((_item) => {
              // check index
              let exists = (methods.watch('shift_review') || []).find(
                (_review) => _review.department_id == _item.value,
              );
              return {
                ..._item,
                disabled: exists ? true : false,
              };
            })}
            disabled={disabled}
            className='bw_inp'
            style={{ padding: '0px 16px' }}
            placeholder={'--Chọn--'}
            onChange={(value) => {
              handleChangeReviewShift(idx, 'department_id', value);
            }}
          />
        ),
      },
      {
        header: 'Người duyệt',
        formatter: (p, idx) => (
          <FormSelect
            value={methods.watch(`shift_review.${idx}.user_review`)}
            list={methods.watch(`shift_review.${idx}.users`)}
            mode='multiple'
            disabled={disabled}
            className='bw_inp'
            style={{ padding: '0px 16px' }}
            placeholder={'--Chọn--'}
            onChange={(value) => {
              if (Array.isArray(value)) {
                let formatter = (value || [])?.map((_) => {
                  return { id: _, value: _ };
                });
                handleChangeReviewShift(idx, 'user_review', formatter);
              }
            }}
          />
        ),
      },
    ],
    [methods.watch('shift_review'), departmentOpts, disabled, isEdit],
  );

  const renderData = useCallback(
    (valueRender, keyRender) => (
      <tr>
        {columns?.map((column, key) => {
          if (column.formatter) {
            return (
              <td className={column?.classNameBody} style={column?.styleBody} key={`${keyRender}${key}`}>
                {column?.formatter(valueRender, keyRender)}
              </td>
            );
          } else if (column.accessor) {
            return (
              <td className={column?.classNameBody} style={column?.styleBody} key={`${keyRender}${key}`}>
                {valueRender[column.accessor]}
              </td>
            );
          } else {
            return <td className={column?.classNameBody} style={column?.styleBody} key={`${keyRender}${key}`}></td>;
          }
        })}

        <td className='bw_sticky bw_action_table bw_text_center'>
          <a
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                dispatch(
                  showConfirmModal(msgError['model_error'], async () => {
                    handleDelete(keyRender);
                  }),
                );
              }
            }}
            style={{
              marginRight: '2px',
            }}
            className={`bw_btn_table bw_red`}>
            <i className={`fi fi-rr-trash`}></i>
          </a>
        </td>
      </tr>
    ),
    [columns],
  );

  return (
    <React.Fragment>
      <BWAccordion title={title} id={id} isRequired>
        <div className='bw_table_responsive bw_mt_1'>
          <table className='bw_table'>
            <thead>
              {columns?.map((p, idx) => (
                <th key={idx} className={p?.classNameHeader} style={p?.styleHeader}>
                  {p?.header}
                </th>
              ))}
              <th className='bw_sticky bw_action_table bw_text_center' style={{ width: '7%' }}>
                Thao tác
              </th>
            </thead>
            <tbody>
              {methods.watch('shift_review') && methods.watch('shift_review').length ? (
                (methods.watch('shift_review') || [])?.map((value, key) => {
                  return renderData(value, key);
                })
              ) : (
                <tr>
                  <td colSpan={11} className='bw_text_center'>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!disabled ? (
          <a className='bw_btn_outline bw_btn_outline_success bw_add_us' onClick={() => handleAddReviewShitf()}>
            <span className='fi fi-rr-plus'></span>
            Thêm mức duyệt
          </a>
        ) : null}
      </BWAccordion>
    </React.Fragment>
  );
};

export default ShiftReviewTable;
