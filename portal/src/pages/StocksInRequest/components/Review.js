import React, { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useAuth } from '../../../context/AuthProvider';
import { Alert } from 'antd';

import BWAccordion from 'components/shared/BWAccordion/index';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { getOptionsStocksReviewLevel } from 'services/stocks-in-request.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import ModalReview from './ModalReview';
import CheckAccess from '../../../navigation/CheckAccess';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

function Review({ disabled, loadStocksInRequestDetail }) {
  const { user } = useAuth();
  const methods = useFormContext();
  const { watch, setValue, formState, control } = methods;
  const [showModalReview, setShowModalReview] = useState(false);
  const [itemReviewLevel, setItemReviewLevel] = useState(null);

  useEffect(() => {
    if (watch('stocks_in_type_id')) {
      getOptionsStocksReviewLevel({ stocks_in_type_id: watch('stocks_in_type_id') }).then((data) => {
        if (!watch('stocks_in_request_id')) {
          setValue('review_level_list', data);
        } else {
          let opts = (watch('review_level_list') || []).map((r) => {
            r.list_user = data.find((u) => u.stocks_review_level_id === r.stocks_review_level_id).list_user;
            return r;
          });
          if (!watch('review_level_list').length) {
            opts = data;
          }
          setValue('review_level_list', opts);
        }
      });
    }
  }, [watch('stocks_in_type_id')]);

  const handleReview = (item) => {
    setItemReviewLevel(Object.assign({ ...item, stocks_in_request_id: watch('stocks_in_request_id') }));
    setShowModalReview(true);
  };

  const { fields } = useFieldArray({
    control,
    name: 'review_level_list',
    rules: {
      required: false,
      validate: (field) => {
        if (field?.findIndex((_) => !_.review_user && !_.is_auto_reviewed) !== -1) {
          return `Chọn người duyệt dòng số ${field?.findIndex((_) => !_.review_user && !_.is_auto_reviewed) + 1}`;
        }
      },
    },
  });

  return (
    <>
      <BWAccordion title='Mức duyệt' id='bw_stocks_in_review' isRequired>
        {watch('is_auto_review') && watch('review_level_list')?.length === 0 ? (
          <Alert
            message='Hình thức tự động duyệt'
            description='Đối với hình thức tự động duyệt, sẽ không cần người duyệt phiếu.'
            type='info'
            showIcon
          />
        ) : (
          <>
            <div className='bw_table_responsive'>
              <table className='bw_table'>
                <thead>
                  <tr>
                    <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
                    <th className='bw_text_center'>Mức duyệt</th>
                    <th className='bw_text_center'>Người duyệt</th>
                    <th className='bw_text_center'>Thao tác</th>
                    <th className='bw_text_center'>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {watch('review_level_list') && watch('review_level_list').length > 0
                    ? watch('review_level_list').map((r, idx) => {
                        let isCanReview =
                          !(disabled && user.user_name * 1 === watch(`review_level_list.${idx}.review_user`)) ||
                          watch('status_reviewed') === 0;
                        return (
                          <tr key={idx}>
                            <td className='bw_sticky bw_check_sticky bw_text_center'>{idx + 1}</td>
                            <td className='bw_mw_3'>{r.stocks_review_level_name}</td>
                            <td>
                              {r.is_auto_reviewed ? (
                                <span>Mức duyệt tự động</span>
                              ) : (
                                <FormSelect
                                  className='bw_mw_3'
                                  field={`review_level_list.${idx}.review_user`}
                                  list={mapDataOptions4SelectCustom(r.list_user)}
                                  disabled={disabled}
                                  onChange={(e) => {
                                    setValue(`review_level_list.${idx}.review_user`, e);
                                  }}
                                />
                              )}
                            </td>
                            <td className='bw_text_center'>
                              {r.is_auto_reviewed === 1 ? (
                                <span></span>
                              ) : r.is_reviewed === 1 ? (
                                `Đã duyệt ngày ${r.review_date ? r.review_date : ''}`
                              ) : r.is_reviewed === 0 ? (
                                `Không duyệt ngày ${r.review_date ? r.review_date : ''}`
                              ) : (
                                !isCanReview && (
                                  <CheckAccess permission='ST_STOCKSINREQUEST_REVIEW'>
                                    <button
                                      type='button'
                                      disabled={isCanReview}
                                      className={`${isCanReview ? 'bw_btn' : 'bw_btn_outline bw_btn_outline_success'}`}
                                      onClick={() => handleReview(r)}>
                                      Duyệt
                                    </button>
                                  </CheckAccess>
                                )
                              )}
                            </td>
                            <td>
                              {r.review_note}
                              {/* <FormInput
                            className='bw_inp bw_mt_1 bw_mb_1'
                            type='text'
                            field={`review_level_list.${idx}.review_note`}
                            disabled={disabled}
                          /> */}
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>
            </div>
            {formState.errors['review_level_list'] && (
              <ErrorMessage message={formState.errors?.review_level_list?.root?.message} />
            )}
          </>
        )}
      </BWAccordion>
      {showModalReview && (
        <ModalReview
          disabled={disabled}
          itemReviewLevel={itemReviewLevel}
          setShowModalReview={setShowModalReview}
          onRefresh={loadStocksInRequestDetail}
        />
      )}
    </>
  );
}

export default Review;
