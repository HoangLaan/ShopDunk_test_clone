import { notification } from 'antd';
import BWAccordion from 'components/shared/BWAccordion/index';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { getListUserByStoreIdOptions } from '../../helpers/call-api';
import UserItem from './UserItem';

const UserManageStocks = ({ disabled }) => {
  const methods = useFormContext();
  const {
    watch,
    setValue,
    control,
    formState: { errors },
  } = methods;

  const [userOpts, setUserOpts] = useState([]);

  useFieldArray({
    control,
    name: 'stocks_user_manage_list',
    rules: {
      required: false,
      validate: (field) => {
        if (!field || field.length === 0) {
          return 'Vui lòng chọn người quản lý kho';
        }
        for (let i = 0; i < field.length; i++) {
          const item = field[i];
          if (!item.stocks_manager_user) {
            return `Chọn người quản lý kho dòng thứ ${i + 1} `;
          }
        }
      },
    },
  });

  const mappingDisabled = (arr, data, key) => {
    const cloneData = JSON.parse(JSON.stringify(data));
    arr.map((v) => {
      let currentIdx = data.findIndex((_item) => 1 * _item.value === 1 * v[key]);
      if (currentIdx >= 0) {
        cloneData[currentIdx].disabled = true;
      }
    });
    return cloneData;
  };

  const handelAddRowUsers = async () => {
    const { watch } = methods;
    if (!watch('store_id') && watch('type') != 9) {
      notification.warning({ message: `Vui lòng chọn cửa hàng.` });
      return;
    }
    let value = watch('stocks_user_manage_list') ?? [];
    value.push({});
    setValue('stocks_user_manage_list', value);
  };

  const handelRemoveUsers = (index) => {
    let valueClone = [...(watch('stocks_user_manage_list') || [])];
    valueClone.splice(index, 1);
    if (valueClone.length === 0) {
      valueClone = undefined;
    }
    setValue('stocks_user_manage_list', valueClone);
  };

  const getListUser = async (value) => {
    try {
      let user = await getListUserByStoreIdOptions({ store_id: value });

      user = user.map(({ user_name, full_name, ...object }) => ({ value: user_name, label: full_name, ...object }));
      setUserOpts(user);
    } catch (error) {
      notification.error({ message: `Có lỗi xảy ra.` });
    }
  };

  useEffect(() => {
    if (watch('store_id') || watch('type') == 9) {
      getListUser(watch('store_id'));
    }
  }, [watch('store_id'), watch('type')]);

  return (
    <BWAccordion title='Người quản lý kho' id='bw_info_cus' isRequired>
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <th className='bw_sticky bw_check_sticky'>STT</th>
            <th>Tên người quản lý</th>
            <th>Số điện thoại</th>
            <th>Chức vụ</th>
            <th>Phòng ban</th>
            <th className='bw_sticky bw_action_table'>Thao tác</th>
          </thead>
          <tbody>
            {watch('stocks_user_manage_list') && watch('stocks_user_manage_list').length > 0 ? (
              watch('stocks_user_manage_list').map((item, index) => {
                let options = mappingDisabled(watch('stocks_user_manage_list'), userOpts, 'stocks_manager_user');
                return (
                  item && (
                    <UserItem
                      key={index}
                      keyUser={`stocks_user_manage_list.${index}`}
                      item={item}
                      index={index}
                      disabled={disabled}
                      handelRemoveUsers={handelRemoveUsers}
                      userOpts={options}
                      methods={methods}
                    />
                  )
                );
              })
            ) : (
              <tr>
                <td colSpan={12} className='bw_text_center'>
                  Chưa thêm người duyệt
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {errors['stocks_user_manage_list'] && <ErrorMessage message={errors?.stocks_user_manage_list?.root?.message} />}

      {disabled ? null : (
        <a data-href className='bw_btn_outline bw_btn_outline_success bw_add_us' onClick={handelAddRowUsers}>
          <span className='fi fi-rr-plus'></span> Thêm
        </a>
      )}
    </BWAccordion>
  );
};

export default UserManageStocks;
