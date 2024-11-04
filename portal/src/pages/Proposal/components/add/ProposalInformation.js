import React, { Fragment, useCallback, useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions, mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { changeType } from 'pages/Proposal/utils/constants';
import { useFormContext } from 'react-hook-form';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { getListReview, getUserInformation } from 'services/proposal.service';
import moment from 'moment';
const ProposalInformation = ({ disabled, title }) => {
  const { watch, clearErrors, setValue } = useFormContext();
  const { userData, proposalTypeData, departmentData, positionData, levelData } = useSelector((state) => state.global);
  const [isShow, setIsShow] = useState(false);
  const [user, setUser] = useState({});
  const [userManager, setUserManager] = useState({});
  const [disableChangeType, setDisableChangeType] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData) dispatch(getOptionsGlobal('user'));
  }, [dispatch, userData]);

  useEffect(() => {
    if (!proposalTypeData) dispatch(getOptionsGlobal('proposalType'));
  }, [dispatch, proposalTypeData]);

  useEffect(() => {
    if (watch('change_type') === 1 && !departmentData) dispatch(getOptionsGlobal('department'));
    if (watch('change_type') === 2 && !positionData) dispatch(getOptionsGlobal('position'));
    if (watch('change_type') === 3 && !levelData) dispatch(getOptionsGlobal('level'));
  }, [departmentData, positionData, levelData, watch('change_type')]);

  const handleChangeProposalType = (id) => {
    clearErrors('proposal_type_id');
    setValue('proposal_type_id', id);
    setValue('change_type', null);
    getListReview({ proposal_type_id: id }).then((res) => setValue('list_review', res));
  };

  const loadUserInformation = useCallback((user_name, type) => {
    getUserInformation({ user_name: user_name }).then((res) => (type === 1 ? setUser(res) : setUserManager(res)));
  }, []);

  useEffect(() => {
    if (watch('user_name')) loadUserInformation(watch('user_name'), 1);
  }, [watch('user_name')]);

  useEffect(() => {
    if (watch('user_name_manager')) loadUserInformation(watch('user_name_manager'), 2);
  }, [watch('user_name_manager')]);

  useEffect(() => {
    if (watch('proposal_type_id')) {
      const proposal_type = proposalTypeData?.find((x) => x.id === watch('proposal_type_id'))?.parent_id;
      if (proposal_type === 3 || proposal_type === 4) {
        if (proposal_type === 3) {
          setValue('change_type', 5);
        }
        if (proposal_type === 4) {
          setValue('change_type', 4);
        }
        setDisableChangeType(true);
      } else {
        setDisableChangeType(false);
      }
    }
  }, [watch('proposal_type_id')]);
  console.log(watch('effective_date'));
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Nhân viên được đề xuất'>
              <FormSelect
                list={mapDataOptions(userData, {
                  valueName: 'id',
                  labelName: 'name',
                  valueAsNumber: false,
                  valueAsString: true,
                })}
                field={'user_name'}
                validation={{
                  required: 'Nhân viên được đề xuất là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Loại đề xuất'>
              <FormSelect
                field={'proposal_type_id'}
                list={mapDataOptions4SelectCustom(proposalTypeData, 'id', 'name')}
                onChange={handleChangeProposalType}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled label='Phòng ban'>
              <input className='bw_inp' defaultValue={user?.department_name} />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled label='Vị trí'>
              <input className='bw_inp' defaultValue={user?.position_name} />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled label='Cấp'>
              <input className='bw_inp' defaultValue={user?.level_name} />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled label='Loại hợp đồng'>
              <input className='bw_inp' defaultValue={user?.contract_type_name} />
            </FormItem>
            <span
              onClick={() => {
                setIsShow((prev) => !prev);
              }}
              className='bw_mb_2'
              style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
              {' '}
              {isShow ? 'Ẩn ' : 'Hiển thị thêm '} thông tin{' '}
            </span>
          </div>
          {isShow && (
            <Fragment>
              <div className='bw_col_6'>
                <FormItem disabled label='Ngày sinh'>
                  <DatePicker
                    format='DD/MM/YYYY'
                    className='bw_inp'
                    defaultValue={user?.birthday ? dayjs(user.birthday, 'DD/MM/YYYY') : ''}
                  />
                </FormItem>
              </div>
              <div className='bw_col_6'>
                <FormItem disabled={true} label='Dân tộc'>
                  <input className='bw_inp' defaultValue={user?.nation_name} />
                </FormItem>
              </div>
              <div className='bw_col_6'>
                <FormItem disabled={true} label='Quốc tịch'>
                  <input className='bw_inp' defaultValue={user?.country_name} />
                </FormItem>
              </div>
              <div className='bw_col_6'>
                <FormItem disabled={true} label='CMND'>
                  <input className='bw_inp' defaultValue={user?.identity_number} />
                </FormItem>
              </div>
              <div className='bw_col_6'>
                <FormItem disabled={true} label='Nơi cấp'>
                  <input className='bw_inp' defaultValue={user?.identity_place} />
                </FormItem>
              </div>
              <div className='bw_col_6'>
                <FormItem disabled={true} label='Ngày cấp'>
                  <DatePicker
                    className='bw_inp'
                    format='DD/MM/YYYY'
                    defaultValue={user?.identity_date ? dayjs(user.identity_date, 'DD/MM/YYYY') : ''}
                  />
                </FormItem>
              </div>
              <div className='bw_col_6'>
                <FormItem disabled={true} label='Hộ khẩu thường trú'>
                  <input className='bw_inp' defaultValue={user?.permanent_address} />
                </FormItem>
              </div>
            </Fragment>
          )}
          <div className='bw_col_6'>
            <FormItem disabled={true} label='Ngày bắt đầu làm việc'>
              {!disabled ? (
                <DatePicker
                  className='bw_inp'
                  format='DD/MM/YYYY'
                  defaultValue={user?.start_work ? dayjs(user.start_work, 'DD/MM/YYYY') : ''}
                />
              ) : (
                <input
                  className='bw_inp'
                  defaultValue={user?.start_work ? moment(user.start_work).format('DD/MM/YYYY') : ''}
                />
              )}
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} label='Người quản lý trực tiếp '>
              <FormSelect field={'user_name_manager'} list={mapDataOptions4SelectCustom(userData, 'id', 'name')} />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled label='Chức vụ người trực tiếp quản lý'>
              <input className='bw_inp' defaultValue={userManager?.position_name} />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled || disableChangeType} label='Nội dụng thay đổi' isRequired>
              <FormSelect
                list={disableChangeType ? changeType : changeType.filter((x) => x.value !== 4 && x.value !== 5)}
                field={'change_type'}
              />
            </FormItem>
          </div>
          {watch('change_type') && (
            <div className='bw_col_6'>
              <FormItem
                disabled={disabled}
                isRequired
                label={`${watch('change_type') === 4 ? 'Thời gian công tác' : 'Thay đổi'}`}>
                <Fragment>
                  {watch('change_type') === 1 && (
                    <FormSelect
                      field={'department_id'}
                      list={mapDataOptions4SelectCustom(departmentData, 'id', 'name')}
                      validation={{ required: 'Phòng ban chọn là bắt buộc' }}
                    />
                  )}
                  {watch('change_type') === 2 && (
                    <FormSelect
                      field={'position_id'}
                      list={mapDataOptions4SelectCustom(positionData, 'id', 'name')}
                      validation={{ required: 'Vị trí chọn là bắt buộc' }}
                    />
                  )}
                  {watch('change_type') === 3 && (
                    <FormSelect
                      field={'user_level_id'}
                      list={mapDataOptions4SelectCustom(levelData, 'id', 'name')}
                      validation={{ required: 'Cấp chọn là bắt buộc' }}
                    />
                  )}
                  {watch('change_type') === 5 && (
                    <div className='bw_row'>
                      <div className='bw_col_6'>
                        <input type='number' disabled defaultValue={user?.hard_salary} className='bw_inp' />
                      </div>
                      <div className='bw_col_6'>
                        <FormNumber
                          placeholder='Lương đề xuất'
                          field={'proposed_salary'}
                          validation={{ required: 'Lương đề xuất là bắt buộc' }}
                        />
                      </div>
                    </div>
                  )}
                  {watch('change_type') === 4 && (
                    <FormDatePicker
                      field={'working_time'}
                      className='bw_inp'
                      format={'DD/MM/YYYY'}
                      validation={{ required: 'Thời gian công tác là bắt buộc' }}
                    />
                  )}
                </Fragment>
              </FormItem>
            </div>
          )}

          <div className='bw_col_6'>
            <FormItem disabled={disabled} label='Ngày hiệu lực' isRequired>
              {!disabled ? (
                <FormDatePicker
                  field={'effective_date'}
                  className='bw_inp'
                  format={'DD/MM/YYYY'}
                  validation={{ required: 'Ngày hiệu lực là bắt buộc' }}
                />
              ) : (
                <input
                  className='bw_inp'
                  defaultValue={watch('effective_date')}
                  style={{
                    paddingBottom: '10px',
                  }}
                />
              )}
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Lý do đề xuất'>
              <FormTextArea rows={3} field='reason' />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default ProposalInformation;
