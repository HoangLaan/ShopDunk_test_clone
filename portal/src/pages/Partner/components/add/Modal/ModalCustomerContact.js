import Modal from 'components/shared/Modal/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { GENDER_OPTIONS } from 'utils/constants';
import { showToast } from 'utils/helpers';
import { createCustomerContact } from 'services/customer-contact.service';
import { FormProvider, useForm } from 'react-hook-form';

function ModalCustomerContact({ open, onClose, field, onChange }) {
  const methods = useForm({
    defaultValues: {
      gender: 1,
    },
  });
  const handleAddCustomerContact = async (e) => {
    const isValid = await methods.trigger();
    if (isValid) {
      try {
        const data = methods.getValues();
        let obj = {
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number_customer_contact,
          email: data.email_customer_contact,
          gender: data.gender,
          position: data.position,
          is_active: 1,
        };
        const res = await createCustomerContact(obj);
        obj.contact_customer_id = res;
        onChange?.(obj);
        onClose();
        showToast.success(`Thêm thành công`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } catch (error) {
        showToast.error(error?.message ?? 'Có lỗi xảy ra', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    }
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
    width: '55rem',
    marginLeft: '-20px',
    height: '4rem',
    zIndex: 2,
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
    <Modal
      header='Thêm người liên hệ'
      styleModal={styleModal}
      headerStyles={headerStyles}
      titleModal={titleModal}
      closeModal={closeModal}
      witdh={'60%'}
      open={open}
      onClose={onClose}
      footer={<BWButton type='primary' outline content={'Thêm'} onClick={handleAddCustomerContact} />}>
      <FormProvider {...methods}>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormItem style={'gray'} label='Tên' isRequired>
              <FormInput
                type='text'
                field='first_name'
                placeholder='Tên'
                validation={{ required: 'Nhập Tên là bắt buộc' }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem style={'gray'} label='Họ' isRequired>
              <FormInput
                type='text'
                field='last_name'
                placeholder='Họ'
                validation={{ required: 'Nhập họ là bắt buộc' }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem style={'gray'} isRequired label='Email'>
              <FormInput
                type='text'
                field='email_customer_contact'
                placeholder='Nhập Email'
                validation={{
                  required: 'Nhập email là bắt buộc',
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Email không đúng định dạng',
                  },
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem style={'gray'} isRequired label='Số điện thoại'>
              <FormInput
                type='text'
                field='phone_number_customer_contact'
                validation={{ required: 'Nhập số điện thoại là bắt buộc' }}
                placeholder='Nhập số điện thoại'
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem style={'gray'} label='Giới tính '>
              <FormRadioGroup field='gender' list={GENDER_OPTIONS} />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem style={'gray'} label='Chức vụ'>
              <FormInput type='text' field='position' placeholder='Chức vụ' />
            </FormItem>
          </div>
        </div>
      </FormProvider>
    </Modal>
  );
}

export default ModalCustomerContact;
