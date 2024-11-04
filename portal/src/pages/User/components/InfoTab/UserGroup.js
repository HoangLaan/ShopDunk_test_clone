import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { notification, Alert } from 'antd';
// Compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
// Service
import { getOptionsUserGroup } from 'services/user-group.service';
// Utils
import { mapDataOptions4Select } from 'utils/helpers';

export default function UserGroup({ disabled = true }) {
  const [optionsUserGroup, setOptionsUserGroup] = useState(null);
  const [userGroups, setUserGroups] = useState([]);

  const methods = useFormContext();
  const {
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    getOptionsUserGroup()
      .then((options) => setOptionsUserGroup(mapDataOptions4Select(options)))
      .catch((error) => notification.error({ message: window._$g._(error.message) }));
  }, []);

  useEffect(() => {
    setUserGroups(
      (optionsUserGroup || []).filter((x) => (watch('user_groups') || []).findIndex((k) => k.id == x.id) >= 0),
    );
  }, [watch('user_groups')]);

  return (
    <BWAccordion title='Phân quyền' id='bw_role' isRequired={true}>
      <FormItem label='Nhóm người dùng'>
        <FormSelect field='user_groups' list={optionsUserGroup ?? []} disabled={disabled} mode='multiple' />
      </FormItem>
      <div className='bw_table_responsive bw_mt_2'>
        <table className='bw_table'>
          <thead>
            <tr>
              <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
              <th>Tên nhóm</th>
              <th>Mô tả</th>
              {!disabled && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {userGroups.length ? (
              userGroups.map((ug, i) => (
                <tr key={i}>
                  <td className='bw_sticky bw_check_sticky bw_text_center'>{i + 1}</td>
                  <td>{ug.name}</td>
                  <td>{ug?.description}</td>
                  {!disabled && (
                    <td className='bw_sticky bw_action_table bw_text_center'>
                      <a
                        onClick={() =>
                          methods.setValue(
                            'user_groups',
                            watch('user_groups').filter((_) => _.id != ug.id),
                          )
                        }
                        className='bw_btn_table bw_delete bw_red'>
                        <i className='fi fi-rr-trash'></i>
                      </a>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={!disabled ? 4 : 3} className='bw_text_center'>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </BWAccordion>
  );
}
