import React, { Fragment, useEffect, useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router';

import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsDepartment } from 'services/department.service';
import { getUserDepartmentOptions } from 'services/commission.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

import FormInput from 'components/shared/BWFormControl/FormInput';
import { useCommissionContext } from 'pages/Commission/helpers/context';
import { REVIEW_STATUS } from 'pages/Commission/helpers/constants';
import ModalReview from '../Modals/ModalReview';
import { useAuth } from 'context/AuthProvider';

function TableReview({ disabled }) {
  const { isOpenModalReview, setIsOpenModalReview } = useCommissionContext();
  const { watch, setValue } = useFormContext();
  const { user } = useAuth();
  const { id } = useParams();

  const { pathname } = useLocation();
  const allowReview = useMemo(() => pathname.includes('/edit'), [pathname]);

  const watchReviewedUser = watch('reviewed_user');
  const watchReviewedUserDepartment = watch('reviewed_user_department');
  const watchIsReviewed = watch('is_reviewed');

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
              {!disabled &&
                <>
                  <th>Ghi chú duyệt</th>
                  <th>Trạng thái duyệt</th>
                  {!watchIsReviewed && <th className='bw_text_center'>Thao tác</th>}
                </>
              }
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
                />
              </td>
              <td>
                <FormSelect
                  field='reviewed_user'
                  list={optionsUser}
                  allowClear={true}
                  onChange={(e, opt) => {
                    setValue('reviewed_user', e);
                    setValue('reviewed_status', 1);
                  }}
                  placeholder='--Chọn--'
                  disabled={disabled || !watchReviewedUserDepartment}
                />
              </td>
              {!disabled &&
                <>
                  <td>{watch('reviewed_note')}</td>
                  <td
                    className={classNames({
                      bw_green: watchIsReviewed === REVIEW_STATUS.APPROVED,
                      bw_red: watchIsReviewed === REVIEW_STATUS.REFUSE,
                    })}>
                    {!watchIsReviewed && 'Chưa duyệt'}
                    {watchIsReviewed === REVIEW_STATUS.APPROVED && 'Đồng ý duyệt'}
                    {watchIsReviewed === REVIEW_STATUS.REFUSE && 'Từ chối duyệt'}
                  </td>
                  {/* <td className='bw_text_center'>
                    <button
                      data-href='#bw_addattr'
                      className={classNames('bw_btn bw_open_modal', {
                        bw_btn_warning: watchReviewedUser && !disabled,
                        bw_hide: !watchReviewedUser || disabled,
                      })}
                      disabled={!watchReviewedUser || disabled}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpenModalReview(true);
                      }}>
                      Duyệt
                    </button>
                  </td> */}
                  {!watchIsReviewed && (
                    <td className='bw_text_center'>
                      <button
                        data-href='#bw_addattr'
                        // className={classNames('bw_btn bw_open_modal', {
                        //   bw_btn_warning: watchReviewedUser && !disabled,
                        //   bw_hide: !watchReviewedUser || disabled,
                        // })}
                        // disabled={!watchReviewedUser || disabled}
                        className={classNames('bw_btn bw_open_modal', {
                          bw_btn_warning: watchReviewedUser === user.user_name && allowReview,
                          bw_hide: watchReviewedUser !== user.user_name || disabled || !id,
                        })}
                        onClick={(e) => {
                          e.preventDefault();
                          setIsOpenModalReview(true);
                        }}>
                        Duyệt
                      </button>
                    </td>
                  )}

                </>
              }
            </tr>
          </tbody>
        </table>
        <FormInput
          type='text'
          field='reviewed_status'
          validation={{
            required: 'Thông tin duyệt hoa hồng là bắt buộc',
          }}
          hidden={true}
        />
      </div>
      {isOpenModalReview && <ModalReview onClose={onCloseModalReview} commisssionId={id}/>}
    </Fragment>
  );
}

export default TableReview;
