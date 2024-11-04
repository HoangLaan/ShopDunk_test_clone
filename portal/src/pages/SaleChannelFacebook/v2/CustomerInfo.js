import React, { useCallback, useEffect } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Alert } from 'antd';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { isValid } from 'pages/Customer/utils/formRules';
import { FORM_RULES } from 'utils/constants';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormAddressSelect from './FormAddressSelect';
import BWAccordion from 'components/shared/BWAccordion';
import { getDetailCustomer, updateCustomer } from 'services/customer.service';
import fbActions from '../actions';
import { showToast } from 'utils/helpers';

function CustomerInfo() {
  const methods = useForm();
  const dispatch = useDispatch();
  const { facebookUser, conversationSelected, updateFacebookUserError, updateFacebookUserSuccess, facebookUserExist } =
  useSelector((state) => state.scfacebook);

  const member_id = facebookUser?.info?.member_id;

  const loadDetailCustomer = useCallback(() => {
    if (member_id) {
      getDetailCustomer(member_id).then(methods.reset);
    } else {
      methods.reset({});
    }
  }, [member_id]);

  useEffect(loadDetailCustomer, [loadDetailCustomer]);

  const updateFacebookUser = async (data, userExist = {}) => {
    if (!member_id) {
      dispatch(
        fbActions.updateFacebookUser({
          pageId: conversationSelected?.page_id,
          userId: conversationSelected?.user?.user_id,
          formData: { ...data, ...userExist },
        }),
      );
    } else {
      await updateCustomer(member_id, data);
      showToast.success('Cập nhật thông tin khách hàng thành công');
    }
  };

  const onSubmit = (values) => {
    console.log('onSubmit', values);
  };

  return (
    <FormProvider {...methods}>
      <form>
        <BWAccordion title='Thông tin khách hàng' defaultOpen={false}>
          <div className='bw_row'>
            <div className='bw_col_12'>
              <FormItem isRequired label='Họ và tên'>
                <FormInput
                  field='full_name'
                  placeholder='Nhập họ và tên khách hàng'
                  validation={{
                    required: 'Họ và tên là bắt buộc',
                    validate: (value) => {
                      if (!isValid(value)) {
                        return 'Họ và tên không hợp lệ';
                      }
                    },
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem isRequired={true} label='Số điện thoại'>
                <FormInput
                  type='number'
                  field='phone_number'
                  validation={{
                    required: 'Số điện thoại là bắt buộc',
                    pattern: {
                      value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                      message: 'Số điện thoại không hợp lệ.',
                    },
                  }}
                  placeholder='Nhập số điện thoại khách hàng'
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Email'>
                <FormInput
                  field='email'
                  placeholder='Nhập email'
                  validation={{
                    pattern: methods.watch('email') ? FORM_RULES.email.pattern : undefined,
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_12'>
              <FormItem label='Ngày sinh'>
                <FormDatePicker
                  style={{
                    width: '100%',
                    padding: '2px 0px',
                  }}
                  placeholder='Nhập ngày sinh'
                  bordered={false}
                  field='birth_day'
                  format='DD/MM/YYYY'
                />
              </FormItem>
            </div>
          </div>
          <FormAddressSelect />
          <div className='bw_row'>
            {facebookUserExist && (
              <Alert
                type='warning'
                message={
                  <>
                    Có một khách hàng <b>{facebookUserExist.full_name}</b> có số điện thoại này. Bạn có muốn cập nhật
                    thông tin khách hàng này không? <br />
                  </>
                }
                action={
                  <Button
                    className='mt-2'
                    onClick={methods.handleSubmit((data) => updateFacebookUser(data, facebookUserExist))}
                    color='warning'>
                    Xác nhận
                  </Button>
                }
              />
            )}
          </div>
          <div className='bw_text_center bw_pb_2 bw_mt_2'>
            <button
              className='bw_btn bw_btn_primary'
              onClick={methods.handleSubmit((data) => updateFacebookUser(data))}>
              {member_id ? 'Lưu thông tin' : 'Lưu khách hàng'}
            </button>
          </div>
        </BWAccordion>
      </form>
    </FormProvider>
  );
}

export default CustomerInfo;
