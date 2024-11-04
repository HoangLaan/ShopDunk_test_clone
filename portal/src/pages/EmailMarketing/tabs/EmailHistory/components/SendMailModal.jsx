import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';

import { sendListMail, getSender } from 'services/email-marketing.service';
import { mapDataOptions4SelectCustom, openInNewTab, showToast } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import BWButton from 'components/shared/BWButton/index';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';

export default function SendMailModal({ onClose, onRefresh }) {
  const dispatch = useDispatch();
  const { emailTemplateData, emailListData } = useSelector((state) => state.global);

  const [loading, setLoading] = useState(false);
  const methods = useForm({
    defaultValues: {
      mail_supplier: 1,
      mail_type: 1, // 1 gửi thường , 2 gửi theo lịch
    },
  });

  useEffect(() => {
    dispatch(getOptionsGlobal('emailTemplate'));
    dispatch(getOptionsGlobal('emailList'));
    getSender().then((data) => {
      if (data && data.length > 0) {
        const address = data[0]?.address;
        methods.setValue('mail_from', address);
        methods.setValue('mail_reply', address);
      }
    });
  }, []);

  const sendMail = async (data) => {
    setLoading(true);
    sendListMail(data)
      .then(() => {
        showToast.success('Gửi mail thành công !');
        onClose();
        onRefresh();
      })
      .catch((error) => {
        showToast.error(error?.message || 'Gửi mail thất bại !');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '37rem',
    marginLeft: '-20px',
    height: '4rem',
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(sendMail)}>
        <div className='bw_modal bw_modal_open' id='bw_importExcel'>
          <div className='bw_modal_container bw_filter' style={styleModal}>
            <div className='bw_title_modal' style={headerStyles}>
              <h3 style={titleModal}>Gửi mail</h3>
              <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose} style={closeModal}></span>
            </div>
            <div className='bw_main_modal'>
              <FormItem className='bw_col_12' label='Nhà cung cấp' isRequired>
                <FormSelect
                  field='mail_supplier'
                  placeholder='Chọn nhà cung cấp'
                  defaultValue={1}
                  list={[
                    {
                      label: 'Mailchimp',
                      value: 1,
                    },
                  ]}
                  validation={{
                    required: 'Nhà cung cấp không được để trống',
                  }}
                />
              </FormItem>
              <FormItem className='bw_col_12' label='Từ' isRequired>
                <FormInput
                  type='text'
                  field='mail_from'
                  placeholder='Gửi mail từ'
                  validation={{
                    required: 'Gửi mail từ không được để trống',
                  }}
                />
              </FormItem>
              <FormItem className='bw_col_12' label='Chủ đề mail' isRequired>
                <FormInput
                  type='text'
                  field='mail_subject'
                  placeholder='Nhập chủ đề mail'
                  validation={{
                    required: 'Chủ đề mail không được để trống',
                  }}
                />
              </FormItem>
              <FormItem className='bw_col_12' label='Tên hiển thị'>
                <FormInput type='text' field='mail_from_name' placeholder='Nhập tên hiển thị' />
              </FormItem>
              <FormItem className='bw_col_12' label='Danh sách người nhận' isRequired>
                <FormSelect
                  type='text'
                  list={mapDataOptions4SelectCustom(emailListData)}
                  field='email_list_id'
                  placeholder='Chọn danh sách người nhận'
                  validation={{
                    required: 'Người nhận không được để trống',
                  }}
                />
              </FormItem>
              <FormItem className='bw_col_12' label='Phản hồi tới'>
                <FormInput type='text' field='mail_reply' placeholder='Nhập mail phản hổi' />
              </FormItem>
              <FormItem className='bw_col_12' label='Mẫu gửi' isRequired>
                <FormSelect
                  field='email_template_id'
                  placeholder='Mẫu gửi mail'
                  list={mapDataOptions4SelectCustom(emailTemplateData)}
                  validation={{
                    required: 'Mẫu gửi mail không được để trống',
                  }}
                />
              </FormItem>
              <FormItem className='bw_col_12' label='Gửi theo lịch'>
                <FormDatePicker
                  field='send_schedule'
                  showTime
                  placeholder={'hh:mm A DD/MM/YYYY'}
                  style={{
                    width: '100%',
                  }}
                  format={'hh:mm A DD/MM/YYYY'}
                  bordered={false}
                  allowClear
                />
              </FormItem>
              <FormItem className='bw_col_12'>
                <BWButton
                  type='success'
                  icon='fi fi-rr-add'
                  content='Tạo mẫu gửi'
                  onClick={() => {
                    openInNewTab(`/email-template/add`);
                  }}
                />
              </FormItem>
            </div>

            <div className='bw_footer_modal' style={{ justifyContent: 'right' }}>
              <button disabled={loading} className='bw_btn bw_btn_success' type='submit'>
                <span className='fi fi-rr-check'></span> Gửi
              </button>
              <button type='button' className='bw_btn_outline bw_btn_outline_success' onClick={onClose}>
                <span className='fi fi-rr-refresh'></span>
                Đóng
              </button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
