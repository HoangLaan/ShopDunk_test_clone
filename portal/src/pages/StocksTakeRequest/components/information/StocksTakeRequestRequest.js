import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { useSelector } from 'react-redux';
import { FIELD_STOCKSTAKEREQUEST } from 'pages/StocksTakeRequest/utils/constants';
import { useFormContext } from 'react-hook-form';
import { getOptionsUser } from 'services/stocks-take-request.service';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { useParams } from 'react-router-dom';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

const StocksTakeRequestRequest = ({ title, disabled }) => {
  const methods = useFormContext();
  let { stocks_take_request_id } = useParams();
  const { stocksTakeTypeList, departmentList, getStocksTakeTypeLoading, getDepartmentsLoading } = useSelector(
    (o) => o.stocksTakeRequest,
  );

  //const [userReceiver, setUserReceiver] = useState([]);
  const deparment_id = methods.watch(FIELD_STOCKSTAKEREQUEST.department_request_id);

  const loadUserOfDepartmentOptions = (value) => {
    // value return tu input
    return getOptionsUser(deparment_id, {
      key_word: value,
    });
  };

  // const isStockTakeImeiCode =
  //   stocksTakeTypeList.find((p) => parseInt(p?.stocks_take_type_id) === parseInt(methods.watch('stocks_take_type_id')))
  //     ?.is_stocks_take_imei_code ?? 0;

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_4'>
            <FormItem disabled={disabled || stocks_take_request_id} isRequired label='Hình thức kiểm kê'>
              <FormSelect
                disabled={disabled || stocks_take_request_id}
                loading={getStocksTakeTypeLoading}
                field={FIELD_STOCKSTAKEREQUEST.stocks_take_type_id}
                placeholder='Hình thức kiểm kê'
                list={(stocksTakeTypeList ?? [])?.map((o) => {
                  return {
                    label: o?.stocks_take_type_name,
                    value: parseInt(o?.stocks_take_type_id),
                  };
                })}
                validation={{
                  required: !disabled && 'Hình thức kiểm kê là bắt buộc',
                }}
                onChange={(value) => {
                  methods.clearErrors(FIELD_STOCKSTAKEREQUEST.stocks_take_type_id);
                  methods.setValue(FIELD_STOCKSTAKEREQUEST.stocks_take_type_id, value);
                  methods.setValue(FIELD_STOCKSTAKEREQUEST.user_review_list, []);
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={disabled} isRequired label='Tên kỳ kiểm kê'>
              <FormInput
                field={FIELD_STOCKSTAKEREQUEST.stocks_take_request_name}
                placeholder='Tên kỳ kiểm kê'
                validation={{
                  required: !disabled && 'Tên kỳ kiểm kê là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={disabled} isRequired label='Phòng ban yêu cầu'>
              <FormSelect
                loading={getDepartmentsLoading}
                list={(departmentList ?? [])?.map((o) => {
                  return {
                    label: o?.name,
                    value: o?.id,
                  };
                })}
                field={FIELD_STOCKSTAKEREQUEST.department_request_id}
                placeholder='Phòng ban yêu cầu'
                validation={{
                  required: !disabled && 'Phòng ban yêu cầu là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          {/* <div className='bw_col_4'>
            <FormItem disabled={disabled || stocks_take_request_id} isRequired label='Kho kiểm kê'>
              <FormSelect
                mode='multiple'
                loading={getStocksLoading}
                list={(stocksList ?? [])?.map((o) => {
                  return {
                    label: o?.name,
                    value: o?.id,
                    address: o?.address,
                  };
                })}
                field={FIELD_STOCKSTAKEREQUEST.stocks_list_id}
                placeholder='Chọn kho kiểm kê'
                validation={{
                  required: !disabled && 'Chọn kho kiểm kê là bắt buộc',
                }}
                onChange={(value) => {
                  methods.clearErrors(FIELD_STOCKSTAKEREQUEST.stocks_list_id);
                  methods.setValue(FIELD_STOCKSTAKEREQUEST.stocks_list_id, value);
                }}
              />
            </FormItem>
          </div> */}
          {/* <div className='bw_col_4'>
            <FormItem
              disabled={disabled || !methods.watch(FIELD_STOCKSTAKEREQUEST.stocks_id)}
              isRequired
              label='Người nhận'>
              <FormSelect
                list={userReceiver}
                placeholder='Chọn người nhận'
                fetchOptions={loadUserOfDepartmentOptions}
                field={FIELD_STOCKSTAKEREQUEST.receiver}
              />
            </FormItem>
          </div> */}
          {/* <div className='bw_col_4'>
            <FormItem disabled label='Địa chỉ kho'>
              <FormInput field={FIELD_STOCKSTAKEREQUEST.address} placeholder='Địa chỉ kho' />
            </FormItem>
          </div> */}
          <div className='bw_col_4'>
            <FormItem
              disabled={disabled || !methods.watch(FIELD_STOCKSTAKEREQUEST.department_request_id)}
              isRequired
              label='Người yêu cầu'>
              {deparment_id ? (
                <FormDebouneSelect
                  fetchOptions={loadUserOfDepartmentOptions}
                  placeholder='Chọn người yêu cầu'
                  field={FIELD_STOCKSTAKEREQUEST.stocks_take_request_user}
                />
              ) : (
                <FormSelect
                  disabled
                  placeholder='Chọn người yêu cầu'
                  field={FIELD_STOCKSTAKEREQUEST.stocks_take_request_user}
                />
              )}
            </FormItem>
          </div>

          <div className='bw_col_4'>
            <FormItem disabled={disabled} isRequired label='Ngày kiểm kê'>
              <FormDatePicker
                style={{
                  width: '100%',
                }}
                bordered={false}
                field={FIELD_STOCKSTAKEREQUEST.stocks_take_request_date}
                placeholder='DD/MM/YYYY'
                format='DD/MM/YYYY'
              />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Mô tả'>
              <FormTextArea field={FIELD_STOCKSTAKEREQUEST.description} />
            </FormItem>
          </div>

          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <div className='bw_flex bw_align_items_center bw_lb_sex'>
                <label className='bw_checkbox'>
                  <FormInput
                    disabled={disabled}
                    type='checkbox'
                    field='is_all_product'
                    onChange={(e) => {
                      methods.clearErrors('is_all_product');
                      methods.setValue('is_all_product', e.target.checked ? 1 : 0);
                      if (e.target.checked) {
                        methods.setValue('product_list', []);
                      }
                    }}
                  />
                  <span />
                  Kiểm kê tất cả sản phẩm
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

StocksTakeRequestRequest.propTypes = {};
export default StocksTakeRequestRequest;
