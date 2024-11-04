import React, { Fragment } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext } from 'react-hook-form';
import { getBase64 } from 'utils/helpers';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { showToast } from 'utils/helpers';
import { ToastStyle } from 'pages/PayPartner/utils/constants';
import { cdnPath } from 'utils';
import { EMAIL_RULE, PHONE_RULE } from 'pages/PayPartner/utils/formRule';
const PartnerPaymentInformation = ({ disabled, title }) => {
  const methods = useFormContext();

  const renderAvatar = () => {
    if (methods.watch('logo')) {
      return <img src={methods.watch('logo') ? cdnPath(methods.watch('logo')) : null} alt='customer avatar' />;
    }
    return <span className='fi fi-rr-picture' />;
  };

  const handleUploadFile = async (e) => {
    const files = Object.values(e.target.files);
    if (
      files.findIndex((_) => !_.name) !== -1 ||
      files.findIndex((_) => !_.name.match(/\.(doc|docx|pdf|xlsx|xls|jpg|png)$/i)) !== -1
    ) {
      showToast.error(`Tập tin tải lên không đúng định dạng.`, ToastStyle);
      return;
    }
    if (files && files.length > 0) {
      if (files[0]?.size / 1000 > 500) {
        showToast.error('Dung lượng ảnh vượt quá 500kb.', ToastStyle);
        return;
      }
      const getFile = await getBase64(files[0]);
      methods.setValue('logo', getFile);
    }
  };

  return (
    <Fragment>
      <BWAccordion title={'Thông tin đối tác'}>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <div className='bw_col_8'>
              <div className='bw_row'>
                <div className='bw_col_6'>
                  <FormItem disabled={disabled} isRequired label='Mã đối tác'>
                    <FormInput
                      type='text'
                      field='pay_partner_code'
                      placeholder='Nhập mã đối tác'
                      validation={{
                        required: 'Mã đối tác là bắt buộc',
                      }}
                    />
                  </FormItem>
                </div>
                <div className='bw_col_6'>
                  <FormItem disabled={disabled} isRequired label='Tên viết tắt'>
                    <FormInput
                      type='text'
                      field='pay_partner_name'
                      placeholder='Nhập tên viết tắt'
                      validation={{
                        required: 'Tên viết tắt là bắt buộc',
                      }}
                    />
                  </FormItem>
                </div>
                <div className='bw_col_12'>
                  <FormItem disabled={disabled} isRequired label='Tên đối tác'>
                    <FormInput
                      type='text'
                      field='pay_partner_full_name'
                      placeholder='Nhập tên đối tác'
                      validation={{
                        required: 'Tên đối tác là bắt buộc',
                      }}
                    />
                  </FormItem>
                </div>
              </div>
            </div>
            <div className='bw_col_4'>
              <div className='bw_load_image bw_mb_2 bw_text_center'>
                <label className='bw_choose_image'>
                  <input
                    accept='image/*'
                    type='file'
                    onChange={async (e) => {
                      handleUploadFile(e);
                    }}
                  />

                  {renderAvatar()}
                </label>
                <p>Kích thước ảnh: 500px*500px.</p>
                {methods.watch('logo') && (
                  <a
                    onClick={(_) => methods.setValue('logo', null)}
                    style={{
                      marginRight: '2px',
                      display: disabled ? 'none' : '',
                    }}
                    title={'Xóa'}
                    className={`bw_btn_table bw_red`}>
                    <i className={`fi fi-rr-trash`}></i>
                  </a>
                )}
              </div>
            </div>
            <div className='bw_col_12'>
              <FormItem disabled={disabled} label='Mô tả'>
                <FormTextArea rows={3} field='description' placeholder='Nhập mô tả' />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} label='SDT người liên hệ'>
                <FormInput
                  type='text'
                  field='phone_contact'
                  validation={PHONE_RULE}
                  placeholder='Nhập SDT người liên hệ'
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} label='Chức vụ/vị trí'>
                <FormInput type='text' field='position_contact' placeholder='Nhập chức vụ/vị trí' />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} label='Tên người liên hệ'>
                <FormInput type='text' field='name_contact' placeholder='Nhập tên người liên hệ' />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} label='Email'>
                <FormInput
                  type='text'
                  field='email_contact'
                  placeholder='Nhập tên người liên hệ'
                  validation={EMAIL_RULE}
                />
              </FormItem>
            </div>

            <div className='bw_col_12'>
              <FormItem disabled={disabled} label='Ghi chú'>
                <FormTextArea rows={5} type='text' field='note' placeholder='Nhập chức vụ/vị trí' />
              </FormItem>
            </div>
          </div>
        </div>
      </BWAccordion>
    </Fragment>
  );
};

export default PartnerPaymentInformation;
