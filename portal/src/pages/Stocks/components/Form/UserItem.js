/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const UserItem = ({ index, keyUser, disabled, handelRemoveUsers, userOpts, methods }) => {
  const { watch, setValue } = methods;

  const handleOnChangeUser = (value, keyUser) => {
    setValue(`${keyUser}.stocks_manager_user`, value.value || null);
    setValue(`${keyUser}.phone_number`, value.phone_number || null);

    setValue(`${keyUser}.position_id`, value.position_id || null);
    setValue(`${keyUser}.position_name`, value.position_name || null);

    setValue(`${keyUser}.department_id`, value.department_id || null);
    setValue(`${keyUser}.department_name`, value.department_name || null);
  };

  return (
    <React.Fragment>
      <tr>
        <td className='bw_sticky bw_check_sticky'>{index + 1}</td>
        <td>
          <FormSelect
            id='stocks_manager_user'
            className='bw_inp'
            field={`${keyUser}.stocks_manager_user`}
            list={userOpts}
            onChange={(e, o) => handleOnChangeUser(o, `${keyUser}`)}
            disabled={disabled}
            style={{ padding: '2px 8px' }}
          />
        </td>
        <td>
          <span>{watch(`${keyUser}.phone_number`)}</span>
        </td>
        <td>
          <span>{watch(`${keyUser}.position_name`)}</span>
        </td>
        <td>
          <span>{watch(`${keyUser}.department_name`)}</span>
        </td>
        <td className='bw_sticky bw_action_table bw_text_center'>
          <a
            className='bw_btn_table bw_delete bw_red'
            onClick={() => (disabled ? null : handelRemoveUsers(index))}
            disabled={disabled}>
            <i className='fi fi-rr-trash'></i>
          </a>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default UserItem;
