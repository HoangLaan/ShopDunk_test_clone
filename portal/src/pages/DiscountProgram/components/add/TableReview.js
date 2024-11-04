import React, { Fragment, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';

import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsDepartment } from 'services/department.service';
import { getUserDepartmentOptions } from 'services/commission.service';
import { useAuth } from 'context/AuthProvider';
import { ReviewStatus } from 'pages/DiscountProgram/ultils/constant';

import FormSelect from 'components/shared/BWFormControl/FormSelect';
import ModalReviewDetail from './ModalReviewDetail';

function TableReview({ disabled, loadDetail }) {
  const { user } = useAuth();
  const [isOpenModalReview, setIsOpenModalReview] = useState();
  const { watch, clearErrors, setValue } = useFormContext();

  const watchReviewedUser = watch('reviewed_user');
  const discount_program_id = watch('discount_program_id');
  const watchReviewedUserDepartment = watch('reviewed_user_department');
  const watchIsReviewed = +watch('is_review') || 0;

  const [optionsDepartment, setOptionsDepartment] = useState(null);
  const [optionsUser, setOptionsUser] = useState(null);

  useEffect(() => {
    const getData = async () => {
      let _data = await getOptionsDepartment();
      setOptionsDepartment(mapDataOptions4Select(_data));
    };
    getData();
  }, []);

  useEffect(() => {
    if (watchReviewedUserDepartment) {
      const getData = async () => {
        let _data = await getUserDepartmentOptions({
          department_id: watchReviewedUserDepartment,
        });
        setOptionsUser(mapDataOptions4Select(_data));
      };
      getData();
    }
  }, [watchReviewedUserDepartment]);

  const onCloseModalReview = () => {
    setIsOpenModalReview(false);
  };

  return (
    <Fragment>
      <div className='bw_table_responsive bw_mt_2'>
        <table className='bw_table'>
          <thead>
            <tr>
              <th>Phòng ban</th>
              <th>Người duyệt</th>
              {disabled && (
                <>
                  <th>Ghi chú duyệt</th>
                  <th>Trạng thái duyệt</th>
                  <th className='bw_text_center'>Thao tác</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <FormSelect
                  field='reviewed_user_department'
                  list={optionsDepartment}
                  allowClear={true}
                  placeholder='--Chọn--'
                  disabled={disabled}
                  onChange={(value) => {
                    clearErrors('reviewed_user_department');
                    setValue('reviewed_user_department', value);
                    setValue('reviewed_user', null);
                  }}
                />
              </td>
              <td>
                <FormSelect
                  field='reviewed_user'
                  list={optionsUser}
                  allowClear={true}
                  placeholder='--Chọn--'
                  disabled={disabled || !watchReviewedUserDepartment}
                />
              </td>
              {disabled && (
                <>
                  <td>{watch('note_review')}</td>
                  <td
                    className={classNames({
                      bw_green: watchIsReviewed === ReviewStatus.ACCEPT,
                      bw_red: watchIsReviewed === ReviewStatus.REJECT,
                    })}>
                    {watchIsReviewed === ReviewStatus.PENDING && 'Chưa duyệt'}
                    {watchIsReviewed === ReviewStatus.ACCEPT && 'Đồng ý duyệt'}
                    {watchIsReviewed === ReviewStatus.REJECT && 'Từ chối duyệt'}
                  </td>
                  <td className='bw_text_center'>
                    {Boolean(
                      String(user.user_name) === String(watchReviewedUser) && watchIsReviewed === ReviewStatus.PENDING,
                    ) && (
                      <button
                        type='button'
                        data-href='#bw_addattr'
                        className={classNames('bw_btn bw_open_modal', {
                          bw_btn_warning: watchReviewedUser && disabled,
                          bw_hide: !watchReviewedUser || disabled,
                        })}
                        disabled={!watchReviewedUser}
                        onClick={(e) => {
                          setIsOpenModalReview(true);
                          e.preventDefault();
                        }}>
                        Duyệt
                      </button>
                    )}
                  </td>
                </>
              )}
            </tr>
          </tbody>
        </table>
        {isOpenModalReview && (
          <ModalReviewDetail discount_program_id={discount_program_id} onClose={onCloseModalReview} loadDetail={loadDetail} />
        )}
      </div>
    </Fragment>
  );
}

export default TableReview;
