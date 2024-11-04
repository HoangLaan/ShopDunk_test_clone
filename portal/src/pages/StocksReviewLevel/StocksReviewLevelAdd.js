import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, notification } from 'antd';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { showToast } from 'utils/helpers';
import classNames from 'classnames';
import _ from 'lodash';

//service
import { getDetail, create, update } from 'services/stocks-review-level.service';
import { getOptionsCompany } from 'services/company.service';
import { getOptionsDepartment } from 'services/department.service';
import { getOptionsPosition } from 'services/position.service';
//utils
import { mapDataOptions4Select } from 'utils/helpers';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormEditor from 'components/shared/BWFormControl/FormEditor';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import BWButton from 'components/shared/BWButton/index';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const SelectStyle = styled(Select)`
  display: flex;
  .ant-select-selector {
    font-size: 15px !important;
    width: 100%;
  }
  .ant-select-arrow .anticon:not(.ant-select-suffix) {
    pointer-events: none;
  }
  .ant-select-selection-placeholder {
    overflow: visible;
  }
`;
export default function StocksReviewLevelAdd({ stocksReviewLevelId = null, isEdit = true }) {
  const methods = useForm();
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;
  const [optionsCompany, setOptionsCompany] = useState(null);
  const [optionsDepartment, setOptionsDepartment] = useState([{ label: 'Tất cả phòng ban', value: -1 }]);
  const [optionsPosition, setOptionsPosition] = useState([{ label: 'Tất cả vị trí', value: -1 }]);
  const STOCKSTYPE = [
    { value: 0, label: 'Xuất kho', key: 'is_stocks_out' },
    { value: 1, label: 'Nhập kho', key: 'is_stocks_in' },
    { value: 2, label: 'Kiểm kê kho', key: 'is_stocks_take' },
    { value: 3, label: 'Luân chuyển kho', key: 'is_stocks_transfer' },
  ];
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    register('description');
    register('is_apply_all_department');
    // register('is_apply_all_position');
    register('is_active');
  }, [register]);
  const handleScrollToFormItem = (id) => {
    const violation = document.getElementById(id);
    window.scrollTo({
      top: violation.offsetTop,
      behavior: 'smooth',
    });
  };

  const getData = useCallback(() => {
    try {
      if (stocksReviewLevelId) {
        getDetail(stocksReviewLevelId)
          .then((data) => {
            if (data) {
              const _department = data.department.map((x) => x.value);
              const _position = data.position.map((x) => x.value);

              reset({
                ...data,
                stock_type: STOCKSTYPE.findIndex((x) => data[x.key] * 1 === 1),
                position: data.position.length > 0 ? _position : [-1],
                department: data.department.length > 0 ? _department : [-1],
              });
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        reset({
          // department: [-1],
          // is_apply_all_department: optionsDepartment[0].value * 1 === -1 ? 1 : 0,
          position: [-1],
          is_apply_all_position: optionsPosition[0].value * 1 === -1 ? 1 : 0,
          is_active: 1,
          stock_type: 0,
        });
      }
    } catch (error) {}
  }, [stocksReviewLevelId]);
  useEffect(getData, [getData]);

  const getDataOptions = async () => {
    let _company = await getOptionsCompany();
    setOptionsCompany(mapDataOptions4Select(_company));
    if (watch('company_id')) {
      let _dataDepartment = await getOptionsDepartment({
        company_id: watch('company_id'),
      });
      setOptionsDepartment([...optionsDepartment, ...mapDataOptions4Select(_dataDepartment)]);
    }
    let _dataPosition = await getOptionsPosition();
    setOptionsPosition([...optionsPosition, ...mapDataOptions4Select(_dataPosition)]);

    handleDisableOptions(
      'is_apply_all_position',
      'position',
      [...optionsPosition, ...mapDataOptions4Select(_dataPosition)],
      setOptionsPosition,
    );
  };
  useEffect(() => {
    getDataOptions();
  }, []);

  const handleDisableOptions = (is_apply_all, value, options, setOptions) => {
    const defaultValue = watch(is_apply_all) ? [options[0]] : watch(value);
    let opts = (options || []).map((x) => {
      const isCheckAll = (defaultValue || []).filter((k) => k.value * 1 === -1).length;
      return {
        ...x,
        disabled:
          !defaultValue || !defaultValue.length
            ? false
            : !isCheckAll
            ? x.value * 1 === -1
              ? true
              : false
            : x.value * 1 !== -1
            ? true
            : false,
      };
    });
    setOptions(opts);
  };

  const handleChangeCompany = async (company_id) => {
    const _dataDepartment = await getOptionsDepartment({ company_id });

    let optsDefault = [{ label: 'Tất cả phòng ban', value: -1 }];
    const newOptions = [...optsDefault, ...mapDataOptions4Select(_dataDepartment)];

    setOptionsDepartment(newOptions);

    setValue('company_id', company_id);
    //setValue("department_id", null);
    handleDisableOptions('is_apply_all_department', 'department', newOptions, setOptionsDepartment);
  };

  const handleChangeDepartment = (department) => {
    if (department) {
      if (department[0] === -1) {
        setValue('is_apply_all_department', 1);
      } else {
        setValue('is_apply_all_department', 0);
      }
      setValue('department', department);
      handleDisableOptions('is_apply_all_department', 'department', optionsDepartment, setOptionsDepartment);
    }
  };

  const handleChangePosition = (position) => {
    if (position[0] === -1) {
      setValue('is_apply_all_position', 1);
    } else {
      setValue('is_apply_all_position', 0);
    }
    setValue('position', position);
    handleDisableOptions('is_apply_all_position', 'position', optionsPosition, setOptionsPosition);
  };

  useEffect(() => {
    if (watch('company_id')) {
      handleChangeCompany(watch('company_id'));
    }
  }, [watch('company_id')]);

  const onSubmit = async (values) => {
    let formData = {
      ...values,
      ...(STOCKSTYPE || []).reduce((o, x) => {
        o[x.key] = 0;
        return o;
      }, {}),
      [STOCKSTYPE[watch('stock_type')]['key']]: 1,
    };
    try {
      if (stocksReviewLevelId) {
        await update(stocksReviewLevelId, formData);
        showToast.success('Cập nhật mức duyệt thành công', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } else {
        await create(formData);
        showToast.success('Thêm mới mức duyệt thành công', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        reset({ is_active: 1, stock_type: 0 });
      }
      setAlerts([]);
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message}`].concat(errors || []).join('<br/>');
      setAlerts([{ type: 'error', msg }]);
    }
  };

  useEffect(() => {
    if (errors) window.scrollTo(0, 0);
  }, [errors]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        {/* general alerts */}
        {alerts.map(({ type, msg }, idx) => {
          return <Alert key={`alert-${idx}`} type={type} message={msg} showIcon />;
        })}
        <div className='bw_row bw_mt_2'>
          <div className='bw_col_3'>
            <ul className='bw_control_form'>
              <li onClick={() => handleScrollToFormItem('bw_info_cus')}>
                <a
                  data-href='#bw_info_cus'
                  className={classNames({
                    bw_active: Boolean(
                      watch('stocks_review_level_name') &&
                        watch('company_id') &&
                        _.isNumber(watch('stock_type')) &&
                        watch('department') &&
                        watch('position'),
                    ),
                  })}>
                  <span className='fi fi-rr-check' /> Thông tin mức duyệt
                </a>
              </li>

              <li onClick={() => handleScrollToFormItem('bw_mores')}>
                <a data-href='#bw_mores' className='bw_active'>
                  <span className='fi fi-rr-check' /> Trạng thái
                </a>
              </li>
            </ul>
          </div>
          <div className='bw_col_9 bw_pb_6'>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <BWAccordion title='Thông tin mức duyệt' id='bw_info_cus' isRequired={false}>
                  <div className='bw_row'>
                    <div className='bw_col_6'>
                      <FormItem label='Tên mức duyệt' isRequired={true}>
                        <FormInput
                          type='text'
                          field='stocks_review_level_name'
                          placeholder='Nhập tên mức duyệt'
                          validation={{
                            required: 'Tên mức duyệt là bắt buộc',
                          }}
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_6'>
                      <FormItem label='Công ty áp dụng' isRequired={true}>
                        <FormSelect
                          field='company_id'
                          list={optionsCompany}
                          // onChange={handleChangeCompany}
                          validation={{
                            required: 'Công ty là bắt buộc',
                          }}
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_6'>
                      <FormItem label='Phòng ban' isRequired>
                        <SelectStyle
                          mode='multiple'
                          suffixIcon={<CaretDownOutlined />}
                          bordered={false}
                          allowClear={false}
                          placeholder='--Chọn--'
                          optionFilterProp='children'
                          disabled={!isEdit || !watch('company_id')}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          value={watch('department')}
                          options={optionsDepartment}
                          onChange={(value) => {
                            handleChangeDepartment(value);
                          }}
                        />
                        {errors['department'] && <ErrorMessage message={errors['department']?.message} />}
                        {/* <FormSelect
                          field='department'
                          mode='multiple'
                          placeholder='--Chọn--'
                          allowClear={true}
                          list={optionsDepartment}
                          // onChange={handleChangeDepartment}
                          validation={{
                            required: 'Phong ban là bắt buộc',
                          }}
                          disabled={!isEdit}
                        /> */}
                      </FormItem>
                    </div>
                    <div className='bw_col_6'>
                      <FormItem label='Chức vụ' isRequired={true}>
                        <SelectStyle
                          mode='multiple'
                          suffixIcon={<CaretDownOutlined />}
                          bordered={false}
                          allowClear={false}
                          placeholder='--Chọn--'
                          optionFilterProp='children'
                          disabled={!isEdit}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          value={watch('position')}
                          options={optionsPosition}
                          onChange={(value) => {
                            handleChangePosition(value);
                          }}
                        />
                        {errors['position'] && <ErrorMessage message={errors['position']?.message} />}
                        {/* <FormSelect
                          field='position'
                          mode='multiple'
                          placeholder='--Chọn--'
                          allowClear={true}
                          list={optionsPosition}
                          validation={{
                            required: 'Chức vụ là bắt buộc',
                          }}
                          disabled={!isEdit}
                          // onChange={handleChangePosition}
                        /> */}
                      </FormItem>
                    </div>
                    <div className='bw_col_12'>
                      <FormItem label='Mô tả'>
                        <FormTextArea field='description' rows={3} disabled={!isEdit} placeholder='Mô tả' />
                      </FormItem>
                    </div>
                    <div className='bw_col_12'>
                      <div className='bw_frm_box'>
                        <label>
                          Hình thức <span className='bw_red'>*</span>
                        </label>
                        <FormRadioGroup field='stock_type' list={STOCKSTYPE} disabled={!isEdit} custom={true} />
                      </div>
                    </div>
                  </div>
                </BWAccordion>
                <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
                  <div className='bw_row'>
                    <div className='bw_col_12'>
                      <div className='bw_frm_box'>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                          <label className='bw_checkbox'>
                            <FormInput
                              type='checkbox'
                              field='is_active'
                              value={watch('is_active')}
                              disabled={!isEdit}
                            />
                            <span />
                            Kích hoạt
                          </label>
                          <label className='bw_checkbox'>
                            <FormInput type='checkbox' field='is_system' disabled={!isEdit} />
                            <span />
                            Hệ thống
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </BWAccordion>
                <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
                  {isEdit ? (
                    <BWButton
                      type='success'
                      submit
                      icon='fi fi-rr-check'
                      content={stocksReviewLevelId ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
                      onClick={handleSubmit(onSubmit)}
                    />
                  ) : (
                    <BWButton
                      type='success'
                      outline
                      content='Chỉnh sửa'
                      onClick={() => window._$g.rdr(`/stocks-review-level/edit/${stocksReviewLevelId}`)}
                    />
                  )}
                  <BWButton type='' outline content='Đóng' onClick={() => window._$g.rdr('/stocks-review-level')} />
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
