import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { FIELD_STOCKSTAKEREQUEST, REVIEW_TYPES } from 'pages/StocksTakeRequest/utils/constants';
import { setReviewData } from 'pages/StocksTakeRequest/actions';

import DataTable from 'components/shared/DataTable';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWButton from 'components/shared/BWButton';
import FormInput from 'components/shared/BWFormControl/FormInput';

const StocksTakeRequestReview = ({ disabled }) => {
  const dispatch = useDispatch();

  let { stocks_take_request_id } = useParams();

  const methods = useFormContext();
  const { setValue, watch, clearErrors } = methods;

  const { getStocksTakeRequestLoading, stocksTakeTypeData, stocksTakeTypeLoading } = useSelector(
    (state) => state.stocksTakeRequest,
  );
  const loading = stocksTakeTypeLoading || getStocksTakeRequestLoading;

  const is_reviewed = watch('is_reviewed');
  const user_review_list = watch(FIELD_STOCKSTAKEREQUEST.user_review_list);

  useEffect(() => {
    if (+is_reviewed === REVIEW_TYPES.TOBE || +is_reviewed === REVIEW_TYPES.WAIT) {
      if (user_review_list?.length > 0) {
        for (let i = 0; i < user_review_list.length; i++) {
          if (user_review_list[i]?.is_show_review) {
            dispatch(
              setReviewData({
                ...user_review_list[i],
                is_show_review_btn: 1,
                stocks_take_review_list_id: user_review_list[i]?.stocks_take_review_list_id,
                stocks_review_level_id: user_review_list[i]?.stocks_review_level_id,
              }),
            );
            break;
          }
        }
      }
    }
  }, [is_reviewed, user_review_list, dispatch]);

  const columns = [
    {
      header: 'STT',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (_, index) => index + 1,
    },
    {
      header: 'Mức duyệt',
      accessor: 'stocks_review_level_name',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Người duyệt',
      classNameHeader: 'bw_text_center',
      formatter: (p, index) => {
        if (p?.is_auto_reviewed === 1) {
          return 'Mức duyệt tự động';
        } else {
          return (
            <FormSelect
              disabled={disabled}
              bordered
              placeholder='Chọn người duyệt'
              field={`${FIELD_STOCKSTAKEREQUEST.user_review_list}.${index}.user_name`}
              list={(p?.users ?? [])?.map((o) => {
                return {
                  ...o,
                  label: o?.full_name,
                  value: o?.user_name,
                  stocks_review_level_id: o?.stocks_review_level_id,
                  stocks_take_type_review_user_id: o?.stocks_take_type_review_user_id,
                };
              })}
              onChange={(_, option) => {
                clearErrors(`${FIELD_STOCKSTAKEREQUEST.user_review_list}.${index}`);
                setValue(`${FIELD_STOCKSTAKEREQUEST.user_review_list}.${index}`, {
                  user_name: option?.value,
                  stocks_review_level_id: option?.stocks_review_level_id,
                  //stocks_take_type_review_user_id: option?.stocks_take_type_review_user_id,
                });
              }}
              validation={{
                required: 'Vui lòng chọn người duyệt',
              }}
            />
          );
        }
      },
    },
    {
      header: 'Tự động duyệt',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (value, index) => {
        return (
          <>
            <label className='bw_checkbox'>
              <FormInput
                type='checkbox'
                disabled={disabled}
                field={`${FIELD_STOCKSTAKEREQUEST.user_review_list}.${index}.is_auto_reviewed`}
              />
              <span />
            </label>
          </>
        );
      },
    },
    {
      header: 'Mức duyệt cuối',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (value, index) => {
        return (
          <>
            <label className='bw_radio'>
              <FormInput
                type='radio'
                disabled={disabled}
                field={`${FIELD_STOCKSTAKEREQUEST.user_review_list}.${index}.is_complete_reviewed`}
              />
              <span />
            </label>
          </>
        );
      },
    },
  ];

  const actions = {
    header: 'Thao tác',
    classNameBody: 'bw_text_center',
    classNameHeader: 'bw_text_center',
    formatter: (p) => {
      const dataFind = watch('user_review_list')?.find((o) => o?.stocks_review_level_id === p?.stocks_review_level_id);

      if (Boolean(dataFind?.is_show_review)) {
        return (
          <BWButton
            onClick={() =>
              dispatch(
                setReviewData({
                  is_show_review_modal: true,
                  stocks_take_review_list_id: dataFind?.stocks_take_review_list_id,
                  stocks_review_level_id: p?.stocks_review_level_id,
                }),
              )
            }
            content='Duyệt'
            outline
            type='success'
          />
        );
      } else {
        if (!(is_reviewed === REVIEW_TYPES.TOBE)) {
          if (dataFind?.reviewed_date) {
            return (
              <React.Fragment>
                <div>
                  {dataFind?.is_reviewed ? 'Đã duyệt' : 'Từ chối'} vào lúc {dataFind?.reviewed_date}
                </div>
                <div>
                  <b>Lý do:</b>
                  {dataFind?.note}
                </div>
              </React.Fragment>
            );
          } else {
            return 'Đang chờ duyệt';
          }
        }
      }
    },
  };

  return (
    <>
      <DataTable
        loading={loading}
        noSelect
        noPaging
        columns={stocks_take_request_id ? columns.concat(actions) : columns}
        data={stocksTakeTypeData?.stocks_take_review_level_list ?? []}
      />
    </>
  );
};

export default StocksTakeRequestReview;
