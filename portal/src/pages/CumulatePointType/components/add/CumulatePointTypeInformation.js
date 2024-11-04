import React, { useEffect, useMemo } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import DataTable from 'components/shared/DataTable/index';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import { PERMISSION } from 'pages/CumulatePointType/utils/constants';

const CumulatePointTypeInformation = ({ disabled, title }) => {
  const { control, watch } = useFormContext();
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'list_condition',
  });

  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Giá trị đơn hàng',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (item, index) => (
          <div className='bw_row'>
            <div className='bw_col_5'>
              <FormNumber
                bordered
                disabled={disabled}
                field={`list_condition.${index}.order_value_from`}
                placeholder={'Từ'}
              />
            </div>
            <div className='bw_col_1 bw_text_center'>-</div>
            <div className='bw_col_5'>
              <FormNumber
                bordered
                disabled={disabled}
                field={`list_condition.${index}.order_value_to`}
                placeholder={'Đến'}
              />
            </div>
          </div>
        ),
      },
      {
        header: 'Điểm người giới thiệu nhận',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item, index) => (
          <FormNumber
            field={`list_condition.${index}.point_aff_member`}
            validation={{
              required: 'Nhập điểm người giới thiệu nhận là bắt buộc',
            }}
            bordered
          />
        ),
      },
      {
        header: 'Điểm khách hàng nhận',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item, index) => (
          <FormNumber
            field={`list_condition.${index}.point_referred`}
            bordered
            validation={{
              required: 'Nhập điểm khách hàng nhận là bắt buộc',
            }}
          />
        ),
      },
    ],
    [],
  );

  useEffect(() => {
    if (watch('is_apply_condition') === 0) {
      remove(fields.map((_, index) => index));
    }
  }, [watch('is_apply_condition')]);

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm',
        permission: [PERMISSION.ADD, PERMISSION.EDIT],
        hidden: disabled || !Boolean(watch('is_apply_condition')),
        onClick: () =>
          append({
            order_value_from: null,
            order_value_to: null,
            point_aff_member: null,
            point_referred: null,
          }),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        onClick: (value, d) => {
          dispatch(
            showConfirmModal(
              [
                `Xóa điều kiện giá trị đơn hàng từ ${value?.order_value_from} đến ${value?.order_value_to} ra khỏi danh sách cửa hàng áp dụng ?`,
              ],
              () => {
                remove(d);
                return;
              },
            ),
          );
        },
      },
    ];
  }, [disabled, remove, watch('is_apply_condition')]);
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} label='Tên chương trình tích điểm' isRequired>
              <FormInput
                placeholder={'Nhận tên chương trình tích điểm'}
                field={'ac_point_name'}
                validation={{
                  required: 'Tên chương trình tích điểm là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} label='Thời gian tích điểm'>
              <FormRangePicker
                fieldStart={'effective_date_from'}
                fieldEnd={'effective_date_to'}
                allowClear
                format={'DD/MM/YYYY'}
                placeholder={['Từ ngày', 'Đến ngày']}
              />
            </FormItem>
          </div>
          <div className='bw_col_12 '>
            <div className='bw_row'>
              <div className='bw_col_6 bw_collapse_title'>
                {' '}
                <h3>Tỷ lệ tích điểm đơn hàng </h3>
              </div>
              <div className='bw_col_6'>
                <div className='bw_row'>
                  <div className='bw_col_5'>
                    <FormNumber disabled={disabled} field={'value'} addonAfter='VNĐ' bordered />
                  </div>
                  <div className='bw_col_2 bw_text_center'>
                    {' '}
                    <i class='fa fa-arrows-h' aria-hidden='true'></i>
                  </div>
                  <div className='bw_col_5'>
                    {' '}
                    <FormNumber disabled={disabled} field={'point'} addonAfter='Điểm thưởng' bordered />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='bw_col_12'>
            <div className='bw_row'>
              <div className='bw_col_12 bw_collapse_title'>
                <h3>Tỷ lệ tích điểm khách hàng có người giới thiệu</h3>
              </div>
              <div className='bw_col_12 bw_mt_2'>
                <label className='bw_checkbox'>
                  <FormInput disabled={disabled} type='checkbox' field='is_apply_condition' />
                  <span />
                  Áp dụng tích điểm có điều kiện
                </label>
              </div>
              {Boolean(watch('is_apply_condition')) == false ? (
                <div className='bw_col_12 bw_mt_2'>
                  <div className='bw_row'>
                    <div className='bw_col_6'>
                      <label>Đối với người giới thiệu</label>
                    </div>
                    <div className='bw_col_3'>
                      {' '}
                      <FormNumber
                        disabled={disabled || watch('is_apply_condition') === 1}
                        field={'point_aff_member'}
                        addonAfter='Điểm thưởng/Người'
                        bordered
                      />
                    </div>
                  </div>
                  <div className='bw_row bw_mt_2'>
                    <div className='bw_col_6'>
                      <label>Đối với khách hàng</label>
                    </div>
                    <div className='bw_col_3'>
                      <FormNumber
                        disabled={disabled || watch('is_apply_condition') === 1}
                        field={'point_referred'}
                        addonAfter='Điểm thưởng'
                        bordered
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              {Boolean(watch('is_apply_condition')) && (
                <div className='bw_col_12'>
                  <DataTable
                    title={
                      <span>
                        <b>Chú ý:</b> Phải nhập đúng điểm đối với người giới thiệu và đối với khách hàng thì mới được áp
                        dụng
                      </span>
                    }
                    columns={columns}
                    data={fields}
                    actions={actions}
                    noSelect
                    noPaging
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default CumulatePointTypeInformation;
