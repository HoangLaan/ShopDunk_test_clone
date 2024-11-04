/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { notification, Alert } from 'antd';
// Components
import { usePCA } from 'pages/ProductCategory/helpers/context';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
// Services
import { getOptionsUnit } from 'services/unit.service';
import { createAttribute } from 'services/product-category.service';
// Utils
import { mapDataOptions4Select } from 'utils/helpers';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { getBase64 } from 'utils/helpers';

export default function AttributesAdd() {
  const { isOpenModalAttributeAdd, setOpenModalAttributeAdd } = usePCA();
  const methods = useForm();
  const { setValue, setError, getValues, handleSubmit, watch, reset } = methods;
  const [optionsUnit, setOptionsUnit] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    reset({});
  }, [isOpenModalAttributeAdd, reset]);

  useEffect(() => {
    getOptionsUnit()
      .then((res) => setOptionsUnit(mapDataOptions4Select(res)))
      .catch((error) => notification.error({ message: error.message || 'Lỗi lấy đơn vị tính.' }));
  }, []);

  const handleDeleteRow = (idx) => {
    let attributevalues = methods.getValues('attribute_values') ?? [];
    if (!attributevalues || !attributevalues.length) return;
    attributevalues.splice(idx, 1);
    setValue('attribute_values', attributevalues);
  };

  const handleAddRow = (e) => {
    e.preventDefault();
    let values = getValues('attribute_values') ?? [];
    const valuesBlank = values.filter((x) => !x.attribute_value && !x.attribute_image);
    if (values.length && valuesBlank.length) return;
    values.push({
      attribute_image: '',
      attribute_value: '',
      description: '',
    });
    setValue('attribute_values', values);
  };

  const handleFileUpload = async (_, field) => {
    const imageUrl = _.target.files[0];
    const { size } = imageUrl;
    if (size / 1000 > 500) {
      setError(field, { type: 'custom', message: 'Dung lượng ảnh vượt quá 500kb.' });
      return;
    }
    const getFile = await getBase64(imageUrl);
    setValue(field, getFile);
  };

  const onSubmit = async (data) => {
    // Check error first
    let _alerts = [];
    const { attribute_values } = data;
    if (
      attribute_values &&
      attribute_values.length &&
      attribute_values.filter((x) => !x.attribute_image && !x.attribute_value).length
    ) {
      setError('attribute_values', { type: 'custom', message: 'Giá trị hoặc hình ảnh của thuộc tính là bắt buộc.' });
      return;
    }

    try {
      await createAttribute(data);
      notification.success({
        message: 'Thêm mới thuộc tính thành công',
      });
      reset({});
      setOpenModalAttributeAdd(false);
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message}`].concat(errors || []).join('.');
      _alerts.push({ type: 'error', msg });
    } finally {
      setAlerts(_alerts);
    }
  };

  if (!isOpenModalAttributeAdd) return null;
  return (
    <div className='bw_modal bw_modal_open' id='bw_formAdd'>
      <div className='bw_modal_container bw_w800'>
        <div className='bw_title_modal'>
          <h3>Thêm mới thuộc tính</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={() => setOpenModalAttributeAdd(false)}></span>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='bw_main_modal'>
              {(alerts || []).map(({ type, msg }, idx) => {
                return (
                  <Alert
                    key={`alert-${idx}`}
                    type={type}
                    //isOpen={true}
                    message={msg}
                    //toggle={() => setAlerts([])}
                    showIcon
                  />
                );
              })}
              <div className='bw_row'>
                <div className='bw_col_6'>
                  <FormItem label='Tên thuộc tính' isRequired={true}>
                    <FormInput
                      type='text'
                      field='attribute_name'
                      placeholder='Tên thuộc tính'
                      validation={{
                        required: 'Tên thuộc tính là bắt buộc',
                      }}
                    />
                  </FormItem>
                </div>
                <div className='bw_col_6'>
                  <FormItem label='Đơn vị tính' isRequired={true}>
                    <FormSelect
                      field='unit_id'
                      list={optionsUnit}
                      validation={{
                        required: 'Đơn vị tính là bắt buộc',
                      }}
                    />
                  </FormItem>
                </div>
                <div className='bw_col_12'>
                  <div className='bw_frm_box bw_readonly'>
                    <label>Mô tả</label>
                    <FormTextArea field='attribute_description' />
                  </div>
                </div>
                <div className='bw_col_4'>
                  <label className='bw_checkbox'>
                    <FormInput type='checkbox' field='is_form_size' value={watch('is_form_size')} />
                    <span></span>
                    Là thuộc tính kích thước
                  </label>
                </div>
                <div className='bw_col_4'>
                  <label className='bw_checkbox'>
                    <FormInput type='checkbox' field='is_color' value={watch('is_color')} />
                    <span></span>
                    Là thuộc tính màu sắc
                  </label>
                </div>
                <div className='bw_col_4'>
                  <label className='bw_checkbox'>
                    <FormInput type='checkbox' field='is_other' value={watch('is_other')} />
                    <span></span>
                    Là thuộc tính khác
                  </label>
                </div>
                <div className='bw_col_4'>
                  <label className='bw_checkbox'>
                    <FormInput type='checkbox' field='is_material' value={watch('is_material')} />
                    <span></span>
                    Là thuộc tính nguyên liệu
                  </label>
                </div>
              </div>
            </div>
            <div className='bw_table_responsive bw_mt_1'>
              <table className='bw_table'>
                <thead>
                  <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
                  <th>Hình ành</th>
                  <th>Giá trị</th>
                  <th>Mô tả</th>
                  <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>
                </thead>
                <tbody>
                  {watch('attribute_values') && watch('attribute_values').length ? (
                    watch('attribute_values').map((attr, i) => (
                      <tr key={i}>
                        <td className='bw_sticky bw_check_sticky bw_text_center'>{i + 1}</td>
                        <td className='bw_text_center'>
                          <label className='bw_choose_image_table'>
                            <input
                              type='file'
                              field={`attribute_values.${i}.attribute_image`}
                              name={`attribute_values.${i}.attribute_image`}
                              accept='image/*'
                              onChange={(_) => handleFileUpload(_, `attribute_values.${i}.attribute_image`)}
                            />
                            {watch(`attribute_values.${i}.attribute_image`)?.length ? (
                              <img
                                style={{ width: '100%' }}
                                src={watch(`attribute_values.${i}.attribute_image`) ?? ''}
                                alt=''></img>
                            ) : (
                              <span className='fi fi-rr-picture' />
                            )}
                          </label>
                          {methods.formState.errors[`attribute_values.${i}.attribute_image`] && (
                            <ErrorMessage
                              message={methods.formState.errors[`attribute_values.${i}.attribute_image`]?.message}
                            />
                          )}
                        </td>
                        <td className=''>
                          <input
                            type='text'
                            {...methods.register(`attribute_values.${i}.attribute_value`)}
                            placeholder='Giá trị'
                            className='bw_inp bw_mw_2'
                          />
                        </td>
                        <td className=''>
                          <textarea
                            {...methods.register(`attribute_values.${i}.description`)}
                            className='bw_inp bw_mw_2'></textarea>
                        </td>
                        <td className='bw_sticky bw_action_table bw_text_center'>
                          <a onClick={() => handleDeleteRow(i)} className='bw_btn_table bw_delete bw_red'>
                            <i className='fi fi-rr-trash'></i>
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className='bw_text_center'>
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {methods.formState.errors[`attribute_values`] && (
                <ErrorMessage message={methods.formState.errors[`attribute_values`]?.message} />
              )}
            </div>
            <a href='/' onClick={handleAddRow} className='bw_btn_outline bw_btn_outline_success bw_add_us'>
              <span className='fi fi-rr-plus'></span>
              Thêm
            </a>
            <div className='bw_footer_modal bw_mt_3'>
              <button
                type='button'
                onClick={() => {
                  methods.handleSubmit(onSubmit)(getValues());
                }}
                className='bw_btn bw_btn_success'>
                <span className='fi fi-rr-check'></span> Thêm mới
              </button>
              <button className='bw_btn_outline bw_close_modal' onClick={() => setOpenModalAttributeAdd(false)}>
                Đóng
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
