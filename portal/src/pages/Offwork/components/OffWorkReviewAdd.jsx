import React, { useCallback, useMemo } from 'react';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from 'context/AuthProvider';
import BWButton from 'components/shared/BWButton';
import { useFormContext } from 'react-hook-form';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useLocation } from 'react-router-dom';
import FormInput from 'components/shared/BWFormControl/FormInput';

const SelectStyle = styled(Select)`
  display: flex;
  .ant-select-selector {
    font-size: 15px !important;
    width: 100%;
    padding: 0 !important;
    margin: 1.8px 0;
  }
  .ant-select-arrow .anticon:not(.ant-select-suffix) {
    pointer-events: none;
  }
  .ant-select-selection-search {
    width: 100%;
    inset-inline-start: 0 !important;
    inset-inline-end: 0 !important;
  }
`;

const OffWorkReviewAdd = ({ offworkReviewList = [], handleChangeReviewList, disabled = false }) => {
  const { user: userEnt } = useAuth();
  const { watch } = useFormContext();
  const is_approve = watch('is_approve');
  const { pathname } = useLocation();
  const isView = useMemo(() => pathname.includes('/detail'), [pathname]);

  const btnPropsApprove = useCallback((is_review) => {
    const btnProps = {
      2: { content: 'Chưa duyệt', color: '' },
      0: { content: 'Không duyệt', color: 'danger' },
      3: { content: 'Đang duyệt', color: 'warning' },
      1: { content: 'Đã duyệt', color: 'success' },
    };
    return btnProps[is_review];
  }, []);

  return (
    <React.Fragment>
      <div className='bw_row'>
        {offworkReviewList && offworkReviewList.length ? (
          offworkReviewList.map((_user_rl) => {
            let options = [];
            // kiểm tra có user cùng phòng ban hay không
            // ==> nếu có chỉ lấy ra user có cùng phòng ban
            // ==> nếu không tồn tại user có cùng phòng ban thì bỏ qua
            if (_user_rl?.users && _user_rl?.users.length) {
              let same_department = _user_rl?.users.filter((opts) => opts.department_id == userEnt.department_id);

              if (same_department && same_department.length) {
                options = same_department.map(({ username: value, ...item }) => ({
                  label: `${item.full_name} [${value}]`,
                  value,
                  ...item,
                }));
              } else {
                options = _user_rl?.users.map(({ username: value, ...item }) => ({
                  label: `${item.full_name} [${value}]`,
                  value,
                  ...item,
                }));
              }
            }

            return (
              <>
                <div className='bw_col_4' key={_user_rl?.offwork_review_level_id}>
                  <div className='bw_frm_box'>
                    <label>
                      {`${_user_rl?.offwork_review_level_name}`} <span className='bw_red'>*</span>
                    </label>
                    {_user_rl?.is_auto_review ? (
                      <input type='text' value={'Tự động duyệt'} disabled={true} readOnly={true}></input>
                    ) : (
                      <SelectStyle
                        suffixIcon={<CaretDownOutlined />}
                        bordered={false}
                        allowClear={true}
                        showSearch
                        placeholder={'-- Chọn --'}
                        optionFilterProp='children'
                        value={_user_rl?.review_user || null}
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={options}
                        disabled={disabled}
                        onChange={(value) => {
                          handleChangeReviewList(value, _user_rl?.offwork_review_level_id);
                        }}
                      />
                    )}
                  </div>
                </div>

                {isView ? (
                  <>
                    <div className='bw_col_4'>
                      <FormItem label='Trạng thái duyệt'>
                        <span
                          style={{ marginTop: '3px' }}
                          className={`bw_label_outline bw_label_outline_${
                            btnPropsApprove(_user_rl?.is_review)?.color
                          } text-center`}>
                          {btnPropsApprove(_user_rl?.is_review)?.content}
                        </span>
                      </FormItem>
                    </div>
                    <div className='bw_col_4'>
                      <FormItem disabled={disabled} label='Nội dung duyệt'>
                        <FormInput value={_user_rl?.note ?? ''} />
                      </FormItem>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            );
          })
        ) : (
          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <b className='bw_red'>Loại nghỉ phép chưa có thông tin mức duyệt.</b>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
export default OffWorkReviewAdd;
