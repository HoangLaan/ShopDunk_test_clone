import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { getListReviewByStocksOutTypeId } from 'services/stocks-out-request.service';
import { useFormContext } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { reviewTypeOptions } from 'pages/StocksOutRequest/utils/helper';
import { Alert } from 'antd';

const StocksOutRequestReview = ({ disabled }) => {
  const { stocks_out_request_id } = useParams();
  const { pathname } = useLocation();
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);
  const methods = useFormContext();
  const is_auto_review = methods.watch('is_auto_review');

  const stocks_out_type_id = methods.watch('stocks_out_type_id');

  const [dataListReview, setDataListReview] = useState([]);

  const loadReviewList = useCallback(() => {
    if (stocks_out_type_id)
    // methods.setValue("")
      getListReviewByStocksOutTypeId(stocks_out_type_id)
        .then((e) => {
          setDataListReview(
            e.map((p) => ({
              value: p?.stocks_review_level_id,
              label: p?.stocks_review_level_name,
              user_review: p?.user_review,
              is_auto_reviewed: p?.is_auto_reviewed,
            })),
          );
          if (!stocks_out_request_id) {
            methods.setValue('list_review', e ?? []);
          }
        })
        .catch((_) => {})
        .finally(() => {});
  }, [stocks_out_type_id]);
  useEffect(loadReviewList, [loadReviewList]);

  const jsx_table = (
    <div className='bw_table_responsive'>
      <table className='bw_table'>
        <thead>
          <tr>
            <th className='bw_sticky bw_check_sticky'>STT</th>
            <th className=''>Mức duyệt</th>
            <th>Người duyệt</th>
            <th>Ghi chú</th>
            {!isAdd && (
              <>
                <th>Trạng thái duyệt</th>
                <th>Nội dung duyệt</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {(dataListReview ?? []).map((p, key) => {
            return (
              <tr key={key}>
                <td className='bw_sticky bw_check_sticky bw_text_center'>{key + 1}</td>
                <td>
                  <span>{p?.label}</span>
                </td>
                <td>
                  {p?.is_auto_reviewed ? (
                    <span>Mức duyệt tự động</span>
                  ) : (
                    <FormSelect
                      field={`list_review[${key}].user_name`}
                      list={p.user_review?.map((p) => {
                        return {
                          label: `${p?.user_name} - ${p?.full_name}`,
                          value: p?.user_name,
                        };
                      })}
                      onChange={(e) => {
                        methods.setValue(`list_review[${key}]`, {
                          ...p,
                          user_name: e,
                        });
                      }}
                    />
                  )}
                </td>
                {/* <td>{methods.watch(`list_review[${key}].description`)}</td> */}
                <td>
                  <FormItem style={'gray'}>
                    <FormInput disabled={disabled} type='text' field={`list_review[${key}].description`} />
                  </FormItem>
                </td>
                {!isAdd && (
                  <>
                    <td>
                      {
                        reviewTypeOptions.find(
                          (o) => o.value === parseInt(methods.watch(`list_review[${key}].is_reviewed`)),
                        )?.label
                      }
                    </td>
                    <td>{methods.watch(`list_review[${key}].note`)}</td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  return (
    <BWAccordion isRequired title='Duyệt'>
      {is_auto_review ? (
        <Alert
          message='Hình thức tự động duyệt'
          description='Đối với hình thức tự động duyệt, sẽ không cần người duyệt phiếu.'
          type='info'
          showIcon
        />
      ) : (
        jsx_table
      )}
    </BWAccordion>
  );
};

export default StocksOutRequestReview;
